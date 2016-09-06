<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Rastreio;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use PhpSigep\Bootstrap;
use PhpSigep\Model\AccessData;
use PhpSigep\Model\Destinatario;
use PhpSigep\Model\DestinoNacional;
use PhpSigep\Model\Dimensao;
use PhpSigep\Model\Etiqueta;
use PhpSigep\Model\ObjetoPostal;
use PhpSigep\Model\PreListaDePostagem;
use PhpSigep\Model\Remetente;
use PhpSigep\Model\ServicoAdicional;
use PhpSigep\Model\ServicoDePostagem;
use PhpSigep\Pdf\CartaoDePostagem;
use Sunra\PhpSimple\HtmlDomParser;

/**
 * Class RastreioController
 * @package App\Http\Controllers\Pedido
 */
class RastreioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Rastreio::class;

    protected $validationRules = [];

    /**
     * Retorna os rastreios importantes
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function important()
    {
        $model = self::MODEL;
        $list = $model::with(['pedido', 'pedido.cliente', 'pedido.endereco'])
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->whereIn('pedido_rastreios.status', [2, 3, 6])
            ->orderBy('pedido_rastreios.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Altera informações do rastreio
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data->fill(Input::all());
            $data->save();

            /**
             * Atualiza o rastreio
             */
            if (Input::get('status') == 0)
                $this->refresh($data);

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'));

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Atualiza status de todos rastreios
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function refreshAll()
    {
        try {
            $model = self::MODEL;

            $rastreios = $model::whereNotIn('status', [2, 3, 4, 5, 7, 8])->get();

            dd($rastreios);

            foreach ($rastreios as $rastreio) {
                $this->refresh($rastreio);
            }

            return $this->showResponse([]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Atualiza o status de um rastreio
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function refreshStatus($id)
    {
        try {
            $model = self::MODEL;

            $rastreio = $model::findOrFail($id);
            $rastreio = $this->refresh($rastreio);

            return $this->showResponse($rastreio);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Atualiza status do rastreio
     *
     * @param $rastreio
     * @return mixed
     */
    public function refresh($rastreio)
    {
        try {
            $ultimoEvento = $this->lastStatus($rastreio->rastreio);

            $prazoEntrega = date('d/m/Y', strtotime($rastreio->data_envio));
            $prazoEntrega = \SomaDiasUteis($prazoEntrega, $rastreio->prazo);
            $prazoEntrega = date('Ymd', \dataToTimestamp($prazoEntrega));

            $status = 1;
            if (!$ultimoEvento['acao']) {
                $status = $rastreio->status;
            } elseif (strpos($ultimoEvento['detalhes'], 'por favor, entre em contato conosco clicando') !== false) {
                $this->screenshot($rastreio);
                $status = 3;
            } elseif(strpos($ultimoEvento['acao'], 'fluxo postal') !== false) {
                $this->screenshot($rastreio);
                $status = 3;
            } elseif ((strpos($ultimoEvento['acao'], 'devolvido ao remetente') !== false) || strpos($ultimoEvento['acao'], 'devolução ao remetente') !== false) {
                $this->screenshot($rastreio);
                $status = 5;
            } elseif (strpos($ultimoEvento['acao'], 'entrega efetuada') !== false) {
                $rastreio->pedido->status = 3;
                $rastreio->pedido->save();

                $this->screenshot($rastreio);

                $status = 4;
            } elseif (strpos($ultimoEvento['acao'], 'aguardando retirada') !== false) {
                $this->screenshot($rastreio);
                $status = 6;
            } elseif ($prazoEntrega < date('Ymd')) {
                $status = 2;
            }

            if ($rastreio->status == 0 && ($rastreio->status != $status)) {
                $rastreio->data_envio = Carbon::createFromFormat('d/m/Y H:i', $this->firstStatus($rastreio->rastreio)['data'])->format('Y-m-d');
            }

            $rastreio->status           = $status;
            $rastreio->save();

            return $rastreio;
        } catch (\Exception $e) {
            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Tira uma foto da tela do rastreio nos correios
     * @param  Object  $rastreio
     * @return boolean
     */
    protected function screenshot($rastreio)
    {
        try {
            $browsershot = new \Spatie\Browsershot\Browsershot();
            $browsershot
                ->setURL($rastreio->rastreio_url)
                ->setWidth(1024)
                ->setHeight(1024)
                ->setTimeout(5000)
                ->save(storage_path('app/public/rastreio/'. $rastreio->rastreio .'.jpg'));

            $rastreio->imagem_historico = $rastreio->rastreio . '.jpg';
            $rastreio->save();
        } catch (\Exception $e) {
            \Log::error(logMessage($e, 'Não foi possível salvar a imagem do rastreio'));
        }
    }

    /**
     * Retorna o prazo de entrega dos correios
     *
     * @param $codigoRastreio
     * @param $cep
     * @return int
     */
    public static function deadline($codigoRastreio, $cep)
    {
        $tipoRastreio    = substr($codigoRastreio, 0, 1);
        $servicoPostagem = null;
        if ($tipoRastreio == 'P') {
            $servicoPostagem = 41106;
        } elseif ($tipoRastreio == 'D') {
            $servicoPostagem = 40010;
        }

        $correios = sprintf(
            "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=%s&sCepDestino=%s&nVlPeso=1&nCdFormato=1&nVlComprimento=16&nVlAltura=10&nVlLargura=12&sCdMaoPropria=n&nVlValorDeclarado=100&sCdAvisoRecebimento=n&nCdServico=%s&nVlDiametro=0&StrRetorno=xml",
            Config::get('tucano.cep'),
            $cep,
            $servicoPostagem
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $correios);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'POST');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $string = curl_exec($ch);

        $correios = simplexml_load_string($string);
        $prazoEntrega = $correios->cServico->PrazoEntrega;

        return $prazoEntrega;
    }

    /**
     * Retorna o histórico de um rastreio nos correios
     *
     * @param array|string $codigos
     * @return array
     */
    public function historico($codigos)
    {
        $codigos = (!is_array($codigos)) ? [$codigos] : $codigos;

        $detalhes = [];
        foreach ($codigos as $key => $item) {
            $correios = sprintf(
                'http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS=%s',
                $item
            );

            $historico = [];
            $detalhes[$key]['codigo'] = $item;

            try {
                $content = HtmlDomParser::file_get_html($correios);
                if (sizeof($content->find('table tr')) > 1) {
                    foreach ($content->find('table tr') as $index => $row) {
                        if ($row->find('td', 0)->plaintext == 'Data')
                            continue;

                        if (sizeof($row->find('td')) > 1) {
                            $historico[$index]['data']  = mb_strtolower(utf8_encode($row->find('td', 0)->plaintext));
                            $historico[$index]['local'] = mb_strtolower(utf8_encode($row->find('td', 1)->plaintext));
                            $historico[$index]['acao']  = mb_strtolower(utf8_encode($row->find('td', 2)->plaintext));
                            $historico[$index]['detalhes'] = '';
                        } else {
                            $historico[$index - 1]['detalhes'] = mb_strtolower(utf8_encode($row->find('td', 0)->plaintext));
                        }
                    }
                }
            } catch (\Exception $e) {

            }

            $detalhes[$key]['historico'] = $historico;
        }

        return (sizeof($detalhes) == 1) ? $detalhes[0] : $detalhes;
    }

    /**
     * Retorna o último status de um rastreio nos correios
     *
     * @param $codigoRastreio
     * @return mixed
     */
    public function lastStatus($codigoRastreio)
    {
        return reset($this->historico($codigoRastreio)['historico']);
    }

    /**
     * Retorna o primeiro status de um rastreio nos correios
     *
     * @param $codigoRastreio
     * @return mixed
     */
    public function firstStatus($codigoRastreio)
    {
        return end($this->historico($codigoRastreio)['historico']);
    }

    /**
     * Mostra a imagem de histórico do rastreio
     *
     * @param  int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function imagemHistorico($id)
    {
        $model = self::MODEL;

        if ($rastreio = $model::find($id)) {
            $file_path = storage_path('app/public/rastreio/' . $rastreio->rastreio . '.jpg');

            if (file_exists($file_path)) {
                return response()->make(file_get_contents($file_path), '200')->header('Content-Type', 'image/jpeg');
            }
        }

        return $this->notFoundResponse();
    }

    /**
     * Gera o PDF da etiqueta dos correios
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function etiqueta($id)
    {
        if ($rastreio = Rastreio::find($id)) {
            $accessData = new AccessData(Config::get('tucano.correios.accessData'));

            $config = new \PhpSigep\Config();
            $config->setAccessData($accessData);
            $config->setEnv(\PhpSigep\Config::ENV_PRODUCTION);
            $config->setCacheOptions([
                'storageOptions' => [
                    'enabled'  => false
                ],
            ]);

            Bootstrap::start($config);

            /**
             * Remetente
             */
            $remetente = new Remetente();
            $remetente->setNome(Config::get('tucano.correios.remetente.nome'));
            $remetente->setTelefone(Config::get('tucano.correios.remetente.telefone'));
            $remetente->setLogradouro(Config::get('tucano.correios.remetente.rua'));
            $remetente->setNumero(Config::get('tucano.correios.remetente.numero'));
            $remetente->setComplemento(Config::get('tucano.correios.remetente.complemento'));
            $remetente->setBairro(Config::get('tucano.correios.remetente.bairro'));
            $remetente->setCep(Config::get('tucano.correios.remetente.cep'));
            $remetente->setUf(Config::get('tucano.correios.remetente.uf'));
            $remetente->setCidade(Config::get('tucano.correios.remetente.cidade'));

            /**
             * Dimensões do produto
             */
            $dimensao = new Dimensao();
            $dimensao->setAltura(7);
            $dimensao->setLargura(14);
            $dimensao->setComprimento(23);
            $dimensao->setTipo(Dimensao::TIPO_PACOTE_CAIXA);

            /**
             * Destinatário
             */
            $destinatario = new Destinatario();
            $destinatario->setNome($rastreio->pedido->cliente->nome);
            $destinatario->setLogradouro($rastreio->pedido->endereco->rua);
            $destinatario->setNumero($rastreio->pedido->endereco->numero);
            $destinatario->setComplemento($rastreio->pedido->endereco->complemento);

            $destino = new DestinoNacional();
            $destino->setBairro($rastreio->pedido->endereco->bairro);
            $destino->setCep($rastreio->pedido->endereco->cep);
            $destino->setCidade($rastreio->pedido->endereco->cidade);
            $destino->setUf($rastreio->pedido->endereco->uf);

            /**
             * Rastreio
             */
            $etiqueta = new Etiqueta();
            $etiqueta->setEtiquetaComDv($rastreio->rastreio);
            $etiqueta->setEtiquetaSemDv($etiqueta->getEtiquetaSemDv());

            /**
             * Registro
             */
            $servicoAdicional = new ServicoAdicional();
            $servicoAdicional->setCodigoServicoAdicional(ServicoAdicional::SERVICE_REGISTRO);

            /**
             * Encomenda
             */
            $encomenda = new ObjetoPostal();
            $encomenda->setServicosAdicionais(array($servicoAdicional));
            $encomenda->setDestinatario($destinatario);
            $encomenda->setDestino($destino);
            $encomenda->setDimensao($dimensao);
            $encomenda->setEtiqueta($etiqueta);
            $encomenda->setNotaNumero($rastreio->pedido->nota->numero);
            $encomenda->setLote(round($rastreio->pedido->total));
            $encomenda->setPeso(0.500 * (int) $rastreio->pedido->produtos->count());

            /**
             * Tipo frete
             */
            if ($rastreio->servico == 'SEDEX') {
                $encomenda->setServicoDePostagem(new ServicoDePostagem(ServicoDePostagem::SERVICE_SEDEX_40096));
            } else {
                $encomenda->setServicoDePostagem(new ServicoDePostagem(ServicoDePostagem::SERVICE_PAC_41068));
            }

            $plp = new PreListaDePostagem();
            $plp->setAccessData($accessData);

            $plp->setEncomendas([$encomenda]);
            $plp->setRemetente($remetente);

            $pdf = new CartaoDePostagem($plp, '', public_path('assets/img/carioca.png'));
            $pdf->render();
        }

        return $this->notFoundResponse();
    }
}