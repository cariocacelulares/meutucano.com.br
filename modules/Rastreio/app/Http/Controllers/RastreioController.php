<?php namespace Rastreio\Http\Controllers;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Rastreio\Models\Rastreio;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\PedidoProduto;
use InspecaoTecnica\Models\InspecaoTecnica;
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
use GuzzleHttp\Client;
use Rastreio\Http\Requests\RastreioRequest as Request;

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

            return $this->clientErrorResponse(['exception' => $exception->getMessage()]);
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
                $this->refresh($rastreio);
            }

            return $this->showResponse($rastreio);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
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

            $rastreios = $model::whereNotIn('status', [2, 3, 4, 5, 7, 8])->get();

            foreach ($rastreios as $rastreio) {
                $this->refresh($rastreio);
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao atualizar os rastreios'));
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
            return $this->clientErrorResponse(['exception' => $exception->getMessage()]);
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

            $status = 1;
            if (!$ultimoEvento['acao']) {
                $status = $rastreio->status;
            } elseif (strpos($ultimoEvento['detalhes'], 'por favor, entre em contato conosco clicando') !== false) {
                $status = 3;
            } elseif (strpos($ultimoEvento['acao'], 'fluxo postal') !== false) {
                $status = 3;
            } elseif ((strpos($ultimoEvento['acao'], 'devolvido ao remetente') !== false) || strpos($ultimoEvento['acao'], 'devolução ao remetente') !== false) {
                $status = 5;
            } elseif (strpos($ultimoEvento['acao'], 'entrega efetuada') !== false) {
                $rastreio->pedido->status = 3;
                $rastreio->pedido->save();

                $status = 4;
            } elseif (strpos($ultimoEvento['acao'], 'aguardando retirada') !== false) {
                $status = 6;
            } elseif ($prazoEntrega < date('Ymd')) {
                $status = 2;
            }

            if ($rastreio->status == 0 && ($rastreio->status != $status)) {
                $rastreio->data_envio = Carbon::createFromFormat('d/m/Y H:i', $this->firstStatus($rastreio->rastreio)['data'])->format('Y-m-d');
            }

            $rastreio->status = $status;
            $rastreio->save();

            return $rastreio;
        } catch (\Exception $e) {
            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
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
                ->setURL($rastreio->rastreio_url)
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
        if ($rastreio) {
            $rastreio = $this->screenshot($rastreio);
            $rastreio->save();
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
            $servicoPostagem = 41106;
        } elseif ($tipoRastreio == 'D') {
            $servicoPostagem = 40010;
        }

        $correiosUrl = sprintf(
            "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=%s&sCepDestino=%s&nVlPeso=1&nCdFormato=1&nVlComprimento=16&nVlAltura=10&nVlLargura=12&sCdMaoPropria=n&nVlValorDeclarado=100&sCdAvisoRecebimento=n&nCdServico=%s&nVlDiametro=0&StrRetorno=xml",
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
                        if ($row->find('td', 0)->plaintext == 'Data') {
                            continue;
                        }

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
            $encomenda->setLote(round($rastreio->pedido->total));


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

    /**
     * Busca inspeções técnicas para os seminovos do pedido
     *
     * @param  int $rastreio_id
     * @return Object
     */
    public function getPedidoProdutoInspecao($rastreio_id)
    {
        if ($rastreio = Rastreio::find($rastreio_id)) {
            if ($pedido = Pedido::find($rastreio->pedido_id)) {
                if ($pedidoProdutos = PedidoProduto::where('pedido_id', '=', $pedido->id)->get()) {
                    $semiNovos = [];

                    foreach ($pedidoProdutos as $pedidoProduto) {
                        if ((int)$pedidoProduto->produto->estado == 1) {
                            $semiNovos[] = $pedidoProduto->toArray();
                        }
                    }

                    $inspecoes = [
                        'criar' => [],
                        'reservar' => []
                    ];

                    foreach ($semiNovos as $semiNovo) {
                        $inspecoesDisponiveis = InspecaoTecnica
                            ::where('inspecao_tecnica.produto_sku', '=', $semiNovo['produto_sku'])
                            ->whereNull('inspecao_tecnica.pedido_produtos_id')
                            ->whereNotNull('inspecao_tecnica.revisado_at')
                            ->where('reservado', '=', false)
                            ->orderBy('created_at', 'ASC')
                            ->get(['inspecao_tecnica.*'])
                            ->toArray();

                        for ($i=0; $i < $semiNovo['quantidade']; $i++) {
                            // se existirem produtos revisados
                            if (!empty($inspecoesDisponiveis)) {
                                $inspecoesDisponiveis = array_values($inspecoesDisponiveis);

                                $inspecoes['reservar'][] = [
                                    'inspecao_id' => $inspecoesDisponiveis[0]['id'],
                                    'pedido_produtos_id' => $semiNovo['id'],
                                    'produto_sku' => $semiNovo['produto_sku'],
                                    'titulo' => $semiNovo['produto']['titulo'],
                                    'aplicar' => 1
                                ];

                                unset($inspecoesDisponiveis[0]);
                            } else {
                                // se não precisa adicionar na fila
                                $inspecoes['criar'][] = [
                                    'produto_sku' => $semiNovo['produto_sku'],
                                    'pedido_produtos_id' => $semiNovo['id'],
                                    'titulo' => $semiNovo['produto']['titulo'],
                                    'aplicar' => 1
                                ];
                            }
                        }
                    }

                    return $this->listResponse($inspecoes);
                }
            }
        }

        return $this->notFoundResponse();
    }
}
