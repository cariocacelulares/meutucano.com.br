<?php namespace Rastreio\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use GuzzleHttp\Client;
use Sunra\PhpSimple\HtmlDomParser;
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
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Rastreio\Models\Rastreio;
use Rastreio\Transformers\RastreioTransformer;
use Rastreio\Transformers\Parsers\RastreioParser;
use Rastreio\Http\Requests\Rastreio\DeleteRequest;
use Rastreio\Http\Requests\RastreioRequest as Request;

use correios\Correios;
use correios\Rastreamento\CorreiosRastreamento;
use correios\Sro\CorreiosSroData;

/**
 * Class RastreioController
 * @package Rastreio\Http\Controllers
 */
class RastreioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Rastreio::class;

    /**
     * Retorna os rastreios importantes
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function important()
    {
        $list = (self::MODEL)::with(['pedido', 'pedido.cliente', 'pedido.endereco'])
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->whereIn('pedido_rastreios.status', [2, 3, 6, 9])
            ->orderBy('pedido_rastreios.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(RastreioTransformer::important($list));
    }

    /**
     * Returns a unique resource
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $rastreio = (self::MODEL)::findOrFail($id);

            return $this->showResponse(RastreioTransformer::show($rastreio));
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = (self::MODEL)::create(Input::all());

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse(['exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()]);
        }
    }

    /**
     * Altera informações do rastreio
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id, Request $request)
    {
        try {
            $rastreio = (self::MODEL)::findOrFail($id);
            $rastreio->fill(Input::all());
            $rastreio->save();

            /**
             * Atualiza o rastreio
             */
            if (Input::get('status') == 0) {
                $rastreio = $this->refresh($rastreio);
            }

            return $this->showResponse($rastreio);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Deleta um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id, DeleteRequest $request)
    {
        try {
            $rastreio = (self::MODEL)::findOrFail($id);

            $rastreio->delete_note = Input::get('delete_note');
            $rastreio->save();

            $rastreio->delete();

            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
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

            $rastreiosML = $model
                ::join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
                ->where('pedido_rastreios.status', '=', 2)
                ->where('pedidos.marketplace', '=', 'MERCADOLIVRE')
                ->get();

            foreach ($rastreiosML as $rastreio) {
                $this->refresh($rastreio);
            }

            $rastreios = $model::whereNotIn('status', [2, 3, 4, 5, 7, 8, 9])->get();

            foreach ($rastreios as $rastreio) {
                $this->refresh($rastreio);
            }
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Erro ao atualizar os rastreios'));
            reportError('Erro ao atualizar os rastreios ' . $exception->getMessage() . ' - ' . $exception->getLine());
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
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
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
            if (!$rastreio->prazo) {
                $this->setDeadline($rastreio);
                $rastreio = $rastreio->fresh();
            }

            $ultimoEvento = $this->lastStatus($rastreio->rastreio);

            $prazoEntrega = date('d/m/Y', strtotime($rastreio->data_envio));
            $prazoEntrega = \SomaDiasUteis($prazoEntrega, $rastreio->prazo);
            $prazoEntrega = date('Ymd', \dataToTimestamp($prazoEntrega));

            $dateDiff = 0;
            if ($rastreio->data_envio) {
                $dateDiff = (Carbon::createFromFormat('Y-m-d', date('Y-m-d')))
                    ->diffInDays(Carbon::createFromFormat('Y-m-d', $rastreio->data_envio));
            }

            $status = 1;
            if ($ultimoEvento === false) {
				        return $rastreio;
            } else if (!$ultimoEvento['acao']) {
                $status = $rastreio->status;
            } elseif (in_array($ultimoEvento['status'], [9, 28, 37, 43, 50, 51, 52, 80])) {
                $status = 3;
            } elseif (in_array($ultimoEvento['status'], [4, 5, 6, 8, 10, 21, 26, 33, 36, 40, 42, 48, 49, 56])) {
                $status = 5;
            } elseif (strpos($ultimoEvento['acao'], 'entregue') !== false) {
                $rastreio->pedido->status = 3;
                $rastreio->pedido->save();

                $status = 4;
            } elseif (in_array($ultimoEvento['status'], [2])) {
                $status = 6;
            } elseif ($prazoEntrega < date('Ymd')) {
                $status = 2;
            } else if ($dateDiff > 15) {
                $status = 9;
            }

            if ($rastreio->status == 0 && ($rastreio->status != $status)) {
                if ($firstStatusDate = $this->firstStatus($rastreio->rastreio)['data']) {
                    $rastreio->data_envio = Carbon::createFromFormat('Y-m-d H:i', $firstStatusDate)->format('Y-m-d');
                }
            }

            $rastreio->status = $status;
            $rastreio->save();

            return $rastreio;
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Tira uma foto da tela do rastreio nos correios
     * @param  Rastreio|int  $rastreio
     * @return boolean
     */
    public function screenshot($rastreio)
    {
        try {
            $browsershot = new \Spatie\Browsershot\Browsershot();
            $browsershot
                ->setURL(RastreioParser::getRastreioUrl($rastreio->rastreio))
                ->setWidth(1024)
                ->setHeight(1024)
                ->setTimeout(5000)
                ->save(storage_path('app/public/rastreio/'. $rastreio->rastreio .'.jpg'));

            $rastreio->imagem_historico = $rastreio->rastreio . '.jpg';
            \Log::info('Screenshot salva com sucesso: ' . $rastreio->imagem_historico);

            return $rastreio;
        } catch (\Exception $e) {
            \Log::error(logMessage($e, 'Não foi possível salvar a imagem do rastreio'));

            return false;
        }
    }

    /**
     * Gera ou regera uma imagem do rastreio e salva
     *
     * @param  Rastreio $rastreio
     * @return void
     */
    public function forceScreenshot($rastreio)
    {
        if ($rastreio && $rastreio->rastreio) {
            if ($rastreio = $this->screenshot($rastreio)) {
                $rastreio->save();
            }
        } else {
            \Log::error('Não foi possível gerar um screenshot: rastreio inválido');
        }
    }

    /**
     * Set tracking deadline
     *
     * @param Rastreio $rastreio
     * @return Object
     */
    public function setDeadline(Rastreio $rastreio)
    {
        try {
            $deadline = $this->deadline($rastreio->rastreio, $rastreio->pedido->endereco->cep);

            $rastreio->prazo = $deadline;

            if ($rastreio->save()) {
                \Log::notice('Prazo do rastreio foi atualizado!', [$rastreio]);
                return $this->showResponse($rastreio);
            } else {
                throw new \Exception('Erro ao salvar o rastreio.', 1);
            }
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Não foi possível inserir o prazo no rastreio'));

            return $this->clientErrorResponse('Não foi possível inserir o prazo no rastreio', [$rastreio]);
        }
    }

    /**
     * Retorna o prazo de entrega dos correios
     *
     * @param  string $codigoRastreio   código ou letra do rastreio
     * @param  string|null $cep         cep para calcular o prazo
     * @return int                      prazo em dias
     */
    public static function deadline($codigoRastreio, $cep = null)
    {
        if (is_null($cep)) {
            $rastreio = Rastreio::where('rastreio', '=', $codigoRastreio)->first();

            if (!$rastreio) {
                return null;
            }

            $cep = $rastreio->getCep();
        }

        $tipoRastreio    = substr($codigoRastreio, 0, 1);
        $servicoPostagem = null;
        if ($tipoRastreio == 'P') {
            $servicoPostagem = '04510';
        } elseif ($tipoRastreio == 'D') {
            $servicoPostagem = '04014';
        } elseif ($tipoRastreio == 'O') {
            $servicoPostagem = '81019';
        }

        if (!$servicoPostagem) {
            if (!isset($rastreio)) {
                $rastreio = Rastreio::where('rastreio', '=', $codigoRastreio)->first();

                if (!$rastreio) {
                    return null;
                }
            }

            if (strtolower($rastreio->pedido->frete_metodo) == 'sedex') {
                $servicoPostagem = '04014';
            } else {
                $servicoPostagem = '04510';
            }
        }

        $correiosUrl = sprintf(
            "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=%s&sDsSenha=%s&sCepOrigem=%s&sCepDestino=%s&nVlPeso=1&nCdFormato=1&nVlComprimento=16&nVlAltura=10&nVlLargura=12&sCdMaoPropria=n&nVlValorDeclarado=100&sCdAvisoRecebimento=n&nCdServico=%s&nVlDiametro=0&StrRetorno=xml",
            Config::get('rastreio.correios.accessData.codAdministrativo'),
            Config::get('rastreio.correios.accessData.senha'),
            Config::get('core.cep'),
            $cep,
            $servicoPostagem
        );

        $client   = new Client();
        $response = $client->request('GET', $correiosUrl);

        $correiosXml = simplexml_load_string(
            $response->getBody()->getContents()
        );

        $prazoEntrega = (string) $correiosXml->cServico->PrazoEntrega;

        return $prazoEntrega;
    }

    /**
     * Retorna o histórico de um rastreio nos correios
     *
     * @param array|string $codigos
     * @return array
     */
    public function historico($codigo)
    {
        $accessData = new AccessData(Config::get('rastreio.correios.accessData'));

        $config = new \PhpSigep\Config();
        $config->setAccessData($accessData);
        $config->setEnv(\PhpSigep\Config::ENV_PRODUCTION);
        $config->setCacheOptions([
            'storageOptions' => [
                'enabled'  => false
            ],
        ]);

        Bootstrap::start($config);

        $etiqueta = new \PhpSigep\Model\Etiqueta();
        $etiqueta->setEtiquetaComDv($codigo);
        $etiqueta->setEtiquetaSemDv($etiqueta->getEtiquetaSemDv());
        $etiquetas[] = $etiqueta;

        $params = new \PhpSigep\Model\RastrearObjeto();
        $params->setAccessData($accessData);
        $params->setEtiquetas($etiquetas);

        $phpSigep = new \PhpSigep\Services\SoapClient\Real();
        $result = $phpSigep->rastrearObjeto($params);

        $historico = [];

        if (!$result->getResult())
          return false;

        foreach ($result->getResult()->getEventos() as $index => $evento) {
            $historico[$index]['status']   = (int) $evento->getStatus();
            $historico[$index]['data']     = $evento->getDataHora();
            $historico[$index]['local']    = $evento->getLocal();
            $historico[$index]['acao']     = $evento->getDescricao();
            $historico[$index]['detalhes'] = $evento->getDetalhe();
        }

        return $historico;
    }

    /**
     * Retorna o último status de um rastreio nos correios
     *
     * @param $codigoRastreio
     * @return mixed
     */
    public function lastStatus($codigoRastreio)
    {
        $historico = $this->historico($codigoRastreio);

        return is_array($historico) ? reset($historico) : false;
    }

    /**
     * Retorna o primeiro status de um rastreio nos correios
     *
     * @param $codigoRastreio
     * @return mixed
     */
    public function firstStatus($codigoRastreio)
    {
      $historico = $this->historico($codigoRastreio);

      return is_array($historico) ? end($historico) : false;
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
     * Abre a tela de abertura de PI nos Correios
     *
     * @param  int $id
     * @return void
     */
    public function pi($id)
    {
        $rastreio = Rastreio::find($id);

        $infoPi = http_build_query([
            'rastreio'    => $rastreio->rastreio,
            'nome'        => $rastreio->pedido->cliente->nome,
            'cep'         => $rastreio->pedido->endereco->cep,
            'endereco'    => $rastreio->pedido->endereco->rua,
            'numero'      => $rastreio->pedido->endereco->numero,
            'complemento' => $rastreio->pedido->endereco->complemento,
            'bairro'      => $rastreio->pedido->endereco->bairro,
            'data'        => $rastreio->data_envio_readable,
            'tipo'        => $rastreio->servico,
            'status'      => ($rastreio->status == 3) ? 'e' : 'a'
        ]);

        return redirect()->away('http://www2.correios.com.br/sistemas/falecomoscorreios/?' . $infoPi);
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
            $accessData = new AccessData(Config::get('rastreio.correios.accessData'));

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
            $remetente->setNome(Config::get('rastreio.correios.remetente.nome'));
            $remetente->setTelefone(Config::get('rastreio.correios.remetente.telefone'));
            $remetente->setLogradouro(Config::get('rastreio.correios.remetente.rua'));
            $remetente->setNumero(Config::get('rastreio.correios.remetente.numero'));
            $remetente->setComplemento(Config::get('rastreio.correios.remetente.complemento'));
            $remetente->setBairro(Config::get('rastreio.correios.remetente.bairro'));
            $remetente->setCep(Config::get('rastreio.correios.remetente.cep'));
            $remetente->setUf(Config::get('rastreio.correios.remetente.uf'));
            $remetente->setCidade(Config::get('rastreio.correios.remetente.cidade'));

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
            $destino->setNumeroNotaFiscal($rastreio->pedido->notas()->orderBy('created_at', 'DESC')->first()->numero);

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
            $encomenda->setPeso(0.500 * (int) $rastreio->pedido->produtos->count());
            $encomenda->setLote(round($rastreio->pedido->total - $rastreio->pedido->frete_valor));

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

            $pdf = new CartaoDePostagem($plp, '', public_path('assets/img/carioca-negativo.jpg'));

            $pdf->render();
        }

        return $this->notFoundResponse();
    }

    /**
     * Busca produtos seminovos
     *
     * @param  int $rastreio_id
     * @return Object
     */
    public function existsSeminovos($rastreio_id)
    {
        if ($rastreio = Rastreio::find($rastreio_id)) {
            if ($pedido = Pedido::find($rastreio->pedido_id)) {
                if ($pedidoProdutos = PedidoProduto::where('pedido_id', '=', $pedido->id)->get()) {
                    foreach ($pedidoProdutos as $pedidoProduto) {
                        if ((int)$pedidoProduto->produto->estado == 1) {
                            return $this->listResponse(['exists' => true]);
                        }
                    }
                }
            }
        }

        return $this->listResponse(['exists' => false]);
    }
}
