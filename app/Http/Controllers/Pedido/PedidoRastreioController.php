<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
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
 * Class PedidoNotaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoRastreioController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreio::class;

    protected $validationRules = [];

    /**
     * Return active rastreios
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $model = self::MODEL;

        $fromDate = date("Y-m-d", strtotime("-7 days"));
        $toDate   = date("Y-m-d");

        $pedidos = $model::with([
            'rastreioRef',
            'pi', 'pi.rastreioRef',
            'devolucao', 'devolucao.rastreioRef',
            'logistica', 'logistica.rastreioRef',
            'pedido', 'pedido.cliente', 'pedido.nota', 'pedido.endereco'
        ])
            ->whereIn('status', [2, 3, 6])
            ->orWhereBetween('data_envio', [$fromDate, $toDate])
            ->orderBy('data_envio')
            ->get();

        return $this->listResponse($pedidos);
    }

    /**
     * Edit information about rastreio
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function edit($id)
    {
        try {
            $model = self::MODEL;

            $rastreio = $model::findOrFail($id);

            $endereco = $rastreio->pedido->endereco;
            $endereco->cep = Input::get('cep');
            $endereco->save();

            $rastreio->rastreio   = Input::get('rastreio');
            $rastreio->data_envio = Carbon::createFromFormat('d/m/Y', Input::get('data_envio'))->format('Y-m-d');
            $rastreio->prazo      = Input::get('prazo');
            $rastreio->status     = Input::get('status');

            $rastreio->save();

            /**
             * Atualiza o rastreio
             */
            if (Input::get('status') == 0)
                $this->refresh($rastreio);

            return $this->showResponse(['endereco' => $endereco, 'rastreio' => $rastreio]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Refresh all rastreios
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function refreshAll()
    {
        try {
            $model = self::MODEL;

            $rastreios = $model::whereNotIn('status', [2, 4, 7, 8])->get();

            foreach ($rastreios as $rastreio) {
                $this->refresh($rastreio);
            }

            return $this->index();
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
     * Refresh the status from rastreio
     *
     * @param $rastreio
     * @return mixed
     */
    private function refresh($rastreio)
    {
        $ultimoEvento = $this->lastStatus($rastreio->rastreio);

        $prazoEntrega = date('d/m/Y', strtotime($rastreio->data_envio));
        $prazoEntrega = \SomaDiasUteis($prazoEntrega, $rastreio->prazo);
        $prazoEntrega = date('Ymd', \dataToTimestamp($prazoEntrega));

        $status = 1;
        if (!$ultimoEvento['acao']) {
            $status = $rastreio->status;
        } elseif (strpos($ultimoEvento['detalhes'], 'por favor, entre em contato conosco clicando') !== false) {
            $status = 3;
        } elseif(strpos($ultimoEvento['acao'], 'fluxo postal') !== false) {
            $status = 3;
        } elseif ((strpos($ultimoEvento['acao'], 'devolvido ao remetente') !== false) || strpos($ultimoEvento['acao'], 'devolução ao remetente') !== false) {
            $status = 5;
        } elseif (strpos($ultimoEvento['acao'], 'entrega efetuada') !== false) {
            $status = 4;
        } elseif (strpos($ultimoEvento['acao'], 'aguardando retirada') !== false) {
            $status = 6;
        } elseif ($prazoEntrega < date('Ymd')) {
            $status = 2;
        }

        $rastreio->status = $status;
        $rastreio->save();

        return $rastreio;
    }

    /**
     * Return prazo de entrega  correios
     *
     * @param $codigoRastreio
     * @param $cep
     * @return int
     */
    public static function deadline($codigoRastreio, $cep)
    {
        $tipoRastreio    = substr($codigoRastreio, 0, 2);
        $servicoPostagem = null;
        if (in_array($tipoRastreio, Config::get('tucano.pac'))) {
            $servicoPostagem = 41106;
        } elseif (in_array($tipoRastreio, Config::get('tucano.sedex'))) {
            $servicoPostagem = 40010;
        }

        $correios = sprintf(
            "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=%s&sCepDestino=%s&nVlPeso=1&nCdFormato=1&nVlComprimento=16&nVlAltura=10&nVlLargura=12&sCdMaoPropria=n&nVlValorDeclarado=100&sCdAvisoRecebimento=n&nCdServico=%s&nVlDiametro=0&StrRetorno=xml",
            Config::get('tucano.cep'),
            $cep,
            $servicoPostagem
        );
        $correios = simplexml_load_file($correios);
        $prazoEntrega = $correios->cServico->PrazoEntrega;

        return $prazoEntrega;
    }

    /**
     * Return the history from correios
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

            $content = HtmlDomParser::file_get_html($correios);

            $detalhes[$key]['codigo'] = $item;
            $historico = [];
            if (sizeof($content->find('table tr')) > 1) {
                foreach ($content->find('table tr') as $index => $row) {
                    if ($row->find('td', 0)->plaintext == 'Data')
                        continue;

                    if (sizeof($row->find('td')) > 1) {
                        $historico[$index]['local'] = mb_strtolower(utf8_encode($row->find('td', 1)->plaintext));
                        $historico[$index]['acao'] = mb_strtolower(utf8_encode($row->find('td', 2)->plaintext));
                        $historico[$index]['detalhes'] = '';
                    } else {
                        $historico[$index - 1]['detalhes'] = mb_strtolower(utf8_encode($row->find('td', 0)->plaintext));
                    }
                }
            }

            $detalhes[$key]['historico'] = $historico;
        }

        return (sizeof($detalhes) == 1) ? $detalhes[0] : $detalhes;
    }

    /**
     * Return last status from rastreio
     *
     * @param $codigoRastreio
     * @return mixed
     */
    public function lastStatus($codigoRastreio)
    {
        return reset($this->historico($codigoRastreio)['historico']);
    }

    /**
     * Generate etiqueta
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function etiqueta($id)
    {
        if ($rastreio = PedidoRastreio::find($id)) {
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