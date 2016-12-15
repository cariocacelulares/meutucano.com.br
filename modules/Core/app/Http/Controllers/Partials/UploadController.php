<?php namespace Core\Http\Controllers\Partials;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestResponseTrait;
use Skyhub\Http\Controllers\SkyhubController;
use Core\Http\Controllers\Pedido\NotaController;
use Rastreio\Http\Controllers\RastreioController;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\Imposto;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Nota\Devolucao;
use Rastreio\Models\Rastreio;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto\Produto;

/**
 * Class UploadController
 * @package Core\Http\Controllers\Partials
 */
class UploadController extends Controller
{
    use RestResponseTrait;

    protected $nfe = null;
    protected $protNfe = null;

    /**
     * Upload
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function upload()
    {
        try {
            $arquivos = Input::file('arquivos');
            $usuario_id = JWTAuth::parseToken()->authenticate()->id;

            $uploadCount = 0;
            $errors = [];
            foreach ($arquivos as $nota) {
                $erro = false;

                /**
                 * Ambiente de testes
                 */
                $notaArquivo = $nota->getClientOriginalName();
                $partsNota = explode('.', $notaArquivo);
                $extensao = strtolower(end($partsNota));

                // Arquivos XML
                if ($extensao !== 'xml') {
                    $erro = true;
                    $errors[] = ['chave' => $notaArquivo, 'message' => 'Formato de arquivo inválido!'];
                } else {
                    $nota->move(storage_path('app/public/nota'), $notaArquivo);

                    try {
                        $xml = simplexml_load_file(storage_path('app/public/nota/' . $notaArquivo));
                    } catch (\Exception $e) {
                        $erro = true;
                        $errors[] = ['chave' => $notaArquivo, 'message' => 'XML inválido!'];
                    }

                    if (!$erro) {
                        if (!isset($xml->NFe->infNFe)) {
                            $erro = true;
                            $errors[] = ['chave' => $notaArquivo, 'message' => 'Nota não reconhecida!'];
                        } else {
                            $this->nfe = $xml->NFe->infNFe;

                            if (isset($xml->protNFe)) {
                                $this->protNfe = $xml->protNFe;
                            } else {
                                $erro = true;
                                $errors[] = ['chave' => $notaArquivo, 'message' => 'Não foi possível identificar o protocolo da nota!'];
                            }
                        }
                    }

                    if (!$erro) {
                        $upload = $this->uploadNota($notaArquivo, $usuario_id);
                        if ($upload === true) {
                            $uploadCount++;
                        } else {
                            $chave = $notaArquivo;
                            $errors[] = ['chave' => $chave, 'message' => $upload];
                        }
                    }
                }
            }

            Log::info(sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($arquivos)));
            return $this->createdResponse([
                'total'   => count($arquivos),
                'success' => $uploadCount,
                'errors'  => $errors
            ]);
        } catch (\Exception $e) {
            Log::alert(logMessage($e, 'Não foi possível fazer upload do(s) arquivo(s)'));

            $data = ['exception' => $e->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Faz o upload da nota e importa informações de cliente, endereço, pedido e rastreio
     *
     * @param  string  $notaArquivo  arquivo da nota
     * @param  boolean|int $usuario  usuário que importou a nota
     * @return boolean
     */
    private function uploadNota($notaArquivo, $usuario_id = false) {
        try {
            if (!$usuario_id) {
                $usuario_id = JWTAuth::parseToken()->authenticate()->id;

                if (!$usuario_id) {
                    $usuario_id = null;
                }
            }

            // Cliente
            $cliente = $this->importCliente();

            // Endereço
            $clienteEndereco = $this->importClienteEndereco($cliente);

            /**
             * Produtos
             */
            $produtos = null;
            if (sizeof($this->nfe->det) > 1) {
                $produtos = $this->nfe->det;
            } else {
                $produtos[] = $this->nfe->det;
            }

            // Operação, CFOP
            $operacao = (int) $produtos[0]->prod->CFOP;

            // Tipo da operação
            $tipoOperacao = null;
            if (in_array($operacao, Config::get('core.notas.operacoes'))) {
                $tipoOperacao = 'venda';
            } else if (in_array($operacao, Config::get('core.notas.devolucao'))) {
                $tipoOperacao = 'devolucao';
            } else if (in_array($operacao, Config::get('core.notas.estorno'))) {
                $tipoOperacao = 'estorno';
            } else {
                return 'Não foi possível identificar a operação da nota (CFOP)!';
            }

            // Chave
            $chave = $this->protNfe->infProt->chNFe;

            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            // Data
            $datetimeNota = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $this->nfe->ide->dhEmi);
            $dataNota = $datetimeNota->format('Y-m-d');

            if (in_array($tipoOperacao, ['devolucao', 'estorno'])) {
                $return = $this->importDevolucao($chave, $usuario_id, $notaArquivo, $tipoOperacao, $dataNota);
            } else {
                // Pedido
                $pedido = $this->importPedido($chave, $cliente, $clienteEndereco, $operacao, $tipoOperacao);
                $return = $this->importVenda($chave, $pedido, $usuario_id, $dataNota, $notaArquivo, $produtos, $datetimeNota);
            }

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            return $return;
        } catch (\Exception $e) {
            if (strstr($e->getMessage(), 'No such file or directory') !== false) {
                // Fecha a transação e comita as alterações
                DB::commit();
                Log::debug('Transaction - commit');

                Log::warning(logMessage($e, 'Não foi possível enviar o e-mail ao cliente!'));

                return 'A nota foi importada, mas não foi possível enviar o e-mail ao cliente!';
            } else {
                // Fecha a trasação e cancela as alterações
                DB::rollBack();
                Log::debug('Transaction - rollback');

                Log::alert(logMessage($e, 'Não foi possível fazer upload do arquivo'));

                if ($e->getCode() == 7) {
                    return $e->getMessage();
                } else {
                    return 'Erro desconhecido!';
                }
            }
        }
    }

    /**
     * Importa os dados do cliente
     *
     * @return Cliente
     */
    private function importCliente() {
        if ($this->nfe->dest->CNPJ) {
            $tipo = 1;
            $taxvat = $this->nfe->dest->CNPJ;
            $ie = $this->nfe->dest->IE;
        } else {
            $tipo = 0;
            $taxvat = $this->nfe->dest->CPF;
            $ie = null;
        }

        $cliente = Cliente::firstOrCreate(['taxvat' => $taxvat]);

        $cliente->taxvat = $taxvat;
        $cliente->tipo = $tipo;
        $cliente->nome = $this->nfe->dest->xNome;
        $cliente->fone = '(' . substr($this->nfe->dest->enderDest->fone, 0, 2) . ') ' . substr($this->nfe->dest->enderDest->fone, 2, 4) . '-' . substr($this->nfe->dest->enderDest->fone, 6, 4);
        $cliente->inscricao = $ie;

        // Só cadastrar email se  o cliente não existia
        if ($cliente->wasRecentlyCreated && $this->nfe->dest->email) {
            $cliente->email = $this->nfe->dest->email;
        }

        if ($cliente->save()) {
            Log::info('Cliente importado ' . $cliente->id);
        } else {
            Log::warning('Não foi possível importar o cliente ' . $taxvat);
        }

        return $cliente;
    }

    /**
     * Importa os dados do endereço  do cliente
     *
     * @param  Cliente $cliente
     * @return Endereco
     */
    private function importClienteEndereco($cliente) {
        $clienteEndereco = Endereco::firstOrCreate(['cliente_id' => $cliente->id, 'cep' => $this->nfe->dest->enderDest->CEP]);

        if ($clienteEndereco->wasRecentlyCreated) {
            $clienteEndereco->cliente_id = $cliente->id;
            $clienteEndereco->cep = $this->nfe->dest->enderDest->CEP;
            $clienteEndereco->rua = $this->nfe->dest->enderDest->xLgr;
            $clienteEndereco->numero = $this->nfe->dest->enderDest->nro;
            $clienteEndereco->complemento = removeAcentos($this->nfe->dest->enderDest->xCpl);
            $clienteEndereco->bairro = $this->nfe->dest->enderDest->xBairro;
            $clienteEndereco->cidade = $this->nfe->dest->enderDest->xMun;
            $clienteEndereco->uf = $this->nfe->dest->enderDest->UF;

            if ($clienteEndereco->save()) {
                Log::info('Endereço do cliente importado ' . $clienteEndereco->id);
            } else {
                Log::warning('Não foi possível importar o endereço do cliente ' . $cliente->id);
            }
        }

        return $clienteEndereco;
    }

    /**
     * Importa os dados do pedido
     *
     * @param  string $chave               chave da nota
     * @param  Cliente $cliente
     * @param  ClienteEndereco $clienteEndereco
     * @param  int $operacao               cfop da operação
     * @param  string $tipoOperacao    venda|devolucao|estorno
     * @return Pedido
     */
    private function importPedido($chave, $cliente, $clienteEndereco, $operacao, $tipoOperacao) {
        $pedido = null;
        $idMarketplace = null;
        $notaTotal = $this->nfe->total->ICMSTot->vNF;

        if ($tipoOperacao == 'devolucao') {
            $notaTotal = ((float) $notaTotal) * -1;
        }

        $marketplace = 'Site';
        if (strpos(strtoupper($this->nfe->infAdic->infCpl), 'B2W') !== false) {
            $marketplace = 'B2W';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'CNOVA') !== false) {
            $marketplace = 'CNOVA';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'MERCADO LIVRE') !== false) {
            $marketplace = 'MERCADOLIVRE';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'WALMART') !== false) {
            $marketplace = 'WALMART';
        } elseif (strpos(strtoupper($this->nfe->infAdic->infCpl), 'GROUPON') !== false) {
            $marketplace = 'GROUPON';
        }

        preg_match('/PEDIDO [0-9]{2,}\-?([0-9]{6,})?\w+/', $this->nfe->infAdic->infCpl, $codPedido);
        if ($codPedido) {
            $idMarketplace = with(new SkyhubController())->parseMarketplaceId($marketplace, substr($codPedido[0], strpos($codPedido[0], ' ') + 1));
            $pedido = Pedido::withTrashed()->where('codigo_marketplace', '=', $idMarketplace)->first();
        }

        if ($pedido == null) {
            $pedido = Pedido::withTrashed()->find((int)substr($chave, 25, 10));
        }

        if (!$pedido) {
            throw new \Exception('O pedido não existe no tucano!', 7);
        }

        if (!in_array($tipoOperacao, ['devolucao', 'estorno'])) {
            if ($idMarketplace) {
                $pedido->codigo_marketplace = $idMarketplace;
            }

            $pedido->cliente_id = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->marketplace = $marketplace;
            $pedido->operacao = $operacao;
            $pedido->total = $notaTotal;
            $pedido->deleted_at = null;

            if ($pedido->save()) {
                Log::info('Pedido importado ' . $pedido->id);
            } else {
                Log::warning('Não foi possível importar o pedido ' . $pedido->id);
            }
        }

        return $pedido;
    }

    /**
     * Importa a devolucao / extorno
     *
     * @param  string $chave              chave da nota
     * @param  int $usuario_id            usuário que subiu a nota
     * @param  sitring $notaArquivo
     * @param  string $tipoOperacao   venda|devolucao|extorno
     * @param  string $dataNota         data que a nota foi emitida
     * @return Devolucao
     */
    private function importDevolucao($chave, $usuario_id, $notaArquivo, $tipoOperacao, $dataNota)
    {
        $notaRef = null;
        if ($ref = $this->nfe->ide->NFref->refNFe) {
            $notaRef = Nota::withTrashed()->where('chave', '=', $ref)->first();
        }

        if (!$notaRef) {
            throw new \Exception('Não foi possível encontrar a nota de referência para a devolução', 7);
        }

        if (!$notaRef) {
            $notaRef = null;
            $params = [
                'chave' => $chave,
            ];
        } else {
            $params = [
                'chave' => $chave,
                'nota_id' => $notaRef->id
            ];
        }

        $devolucao = Devolucao::firstOrNew($params);
        $devolucao->usuario_id = $usuario_id;
        $devolucao->nota_id    = ($notaRef) ? $notaRef->id : null;
        $devolucao->chave      = $chave;
        $devolucao->arquivo    = $notaArquivo;
        $devolucao->tipo       = ($tipoOperacao == 'estorno') ? 1 : 0;
        $devolucao->data       = $dataNota;

        if ($devolucao->save()) {
            Log::info('Devolução de nota importada ' . $devolucao->id);
        } else {
            Log::warning('Não foi possível importar a devolução da nota de venda: ' . $notaRef->id);
        }

        return true;
    }

    /**
     * Importa os dados de uma nota de venda
     *
     * @param  string $chave            chave da nota
     * @param  Pedido $pedido
     * @param  int $usuario_id          usuário que subiu a nota
     * @param  string $dataNota       data que a nota foi emitida
     * @param  string $notaArquivo
     * @param array $produtos
     * @return boolean
     */
    private function importVenda($chave, $pedido, $usuario_id, $dataNota, $notaArquivo, $produtos, $datetimeNota)
    {
        /**
         * Salva a nota
         */
        $nota = Nota::withTrashed()->firstOrNew([
            'pedido_id' => $pedido->id,
            'chave' => $chave
        ]);
        $nota->pedido_id = $pedido->id;
        $nota->usuario_id = $usuario_id;
        $nota->data = $dataNota;
        $nota->chave = $chave;
        $nota->arquivo = $notaArquivo;
        $nota->deleted_at = null;

        if ($nota->save()) {
            Log::info('Nota importada ' . $nota->id);
        } else {
            Log::warning('Não foi possível importar a nota do pedido ' . $pedido->id);
        }

        /**
         * Rastreio
         */
        $rastreio = null;
        preg_match('/([A-Za-z]{2}[0-9]{9})\w+/', $this->nfe->infAdic->infCpl, $codPost);
        if ($codPost) {
            $rastreio = strtoupper(substr($codPost[0], 0, 13));
        }

        if ($rastreio) {
            // Serviço de envio
            $tipoRastreio = substr($rastreio, 0, 1);
            $metodoEnvio = null;
            if ($tipoRastreio == 'P') {
                $metodoEnvio = 'PAC';
            } elseif ($tipoRastreio == 'D') {
                $metodoEnvio = 'SEDEX';
            }

            // Valor de frete
            $freteTotal = null;
            if ($posInicial = strpos(strtoupper($this->nfe->infAdic->infCpl), 'FRETE')) {
                preg_match('/[0-9]{2,3}\.[0-9]{2}/', substr($this->nfe->infAdic->infCpl, $posInicial, 40), $frete);

                if ($frete) {
                    $freteTotal = $frete[0];
                }
            }

            // Data de envio
            if ($datetimeNota->format('w') == '5' && $datetimeNota->format('H') <= 14) {
                $dataEnvio = $datetimeNota;
            } else {
                $dataEnvio = $datetimeNota->add(date_interval_create_from_date_string('+1 day'));
                if ($dataEnvio->format('w') == '6') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+2 day'));
                } else if ($dataEnvio->format('w') == '0') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+1 day'));
                }
            }

            $dataEnvio = $dataEnvio->format('Y-m-d');

            /**
             * Salva o rastreio
             */

            $pedidoRastreio = Rastreio::where('pedido_id', '!=', $pedido->id)->where('rastreio', '=', $rastreio)->first();
            if ($pedidoRastreio) {
                throw new \Exception('O código de rastreio já está sendo utilizado por outra.', 7);
            }

            $pedidoRastreio = Rastreio::firstOrNew(['pedido_id' => $pedido->id, 'rastreio' => $rastreio]);
            $pedidoRastreio->pedido_id = $pedido->id;
            $pedidoRastreio->rastreio = $rastreio;
            $pedidoRastreio->data_envio = $dataEnvio;
            $pedidoRastreio->servico = $metodoEnvio;
            $pedidoRastreio->valor = $freteTotal;
            $pedidoRastreio->prazo = null;

            if ($pedidoRastreio->save()) {
                Log::info('Rastreio importado ' . $pedidoRastreio->id);
            } else {
                Log::warning('Não foi possível importar o rastreio do pedido ' . $pedido->id);
            }
        }

        /**
         * Impostos
         */
        $imposto = Imposto::findOrNew($pedido->id);
        $imposto->pedido_id = $pedido->id;
        $imposto->icms = $this->nfe->total->ICMSTot->vICMS;
        $imposto->pis = $this->nfe->total->ICMSTot->vPIS;
        $imposto->cofins = $this->nfe->total->ICMSTot->vCOFINS;
        $imposto->icms_destinatario = $this->nfe->total->ICMSTot->vICMSUFDest;
        $imposto->icms_remetente = $this->nfe->total->ICMSTot->vICMSUFRemet;

        if ($imposto->save()) {
            Log::info('Imposto importado ' . $imposto->id);
        } else {
            Log::warning('Não foi possível importar o imposto do pedido ' . $pedido->id);
        }

        /**
         * IMEI's
         */
        $lastPos = 0;
        $positions = [];
        while (($lastPos = stripos($this->nfe->infAdic->infCpl, 'PROD.:', $lastPos)) !== false) {
            $positions[] = $lastPos;
            $lastPos = $lastPos + strlen('PROD.:');
        }

        // Separa os imeis por produto
        $produtoImei = [];
        foreach ($positions as $key => $pos) {
            $posFind = ' | ';
            if ((sizeof($positions) - 1) == $key)
            $posFind = '-';

            $lineProduto = substr($this->nfe->infAdic->infCpl, $pos, (stripos($this->nfe->infAdic->infCpl, $posFind, $pos) - $pos));

            $skuProduto = (int)substr($lineProduto, stripos($lineProduto, '.: ') + 3, 5);
            $imeis = trim(substr($lineProduto, stripos($lineProduto, 'S/N') + 5));

            $produtoImei[$skuProduto] = $imeis;
        }

        // Organiza os imeis
        foreach ($produtoImei as $sku => $imeis) {
            $produtoImei[$sku] = explode(',', $imeis);
            $produtoImei[$sku] = array_map(function($imei) {
                return trim($imei);
            }, $produtoImei[$sku]);
        }

        // Organiza os produtos da nota
        $produtosNota = [];
        foreach ($produtos as $produto) {
            $produtosNota[(int)$produto->prod->cProd][] = [
                'sku' => (int) $produto->prod->cProd,
                'titulo' => (string) $produto->prod->xProd,
                'ncm' => (string) $produto->prod->NCM,
                'ean' => (string) $produto->prod->cEAN,
                'quantidade' => (float) $produto->prod->qCom,
                'valor' => (string) $produto->prod->vUnCom,
            ];
        }

        // Organiza as quantidades
        // Se um item da nota for diferente da primeira, vai continuar separada
        foreach ($produtosNota as $sku => $itens) {
            foreach ($itens as $key => $item) {
                if ($key !== 0 && $item === $itens[0]) {
                    $produtosNota[$sku][0]['quantidade'] = $produtosNota[$sku][0]['quantidade'] + (int)$itens[0]['quantidade'];
                    unset($produtosNota[$sku][$key]);
                }
            }

            $produtosNota[$sku] = array_values($produtosNota[$sku]);
        }

        // Produtos que já estao no pedido
        $produtosExistentesOriginal = PedidoProduto::where('pedido_id', '=', $pedido->id)->get();

        // Cadastra os pedidoProdutos
        $cadastrados = [];
        $utilizados = [];
        foreach ($produtosNota as $sku => $itens) {
            foreach ($itens as $key => $item) {
                // Pega o produto por sku
                $produto = Produto::where('sku', '=', $sku)->first();

                if (!$produto) {
                    throw new \Exception("O produto com SKU {$sku} não foi encontrado no tucano.", 7);
                }

                // Pega o pedidoProduto
                $pedidoProduto = PedidoProduto
                    ::where('pedido_id', '=', $pedido->id)
                    ->where('produto_sku', '=', $produto->sku)
                    ->where('valor', '=', $item['valor'])
                    ->whereNotIn('id', $utilizados)
                    ->first();

                // Se nao tiver pedidoProduto, cria um
                if (!$pedidoProduto) {
                    $pedidoProduto = PedidoProduto::create([
                        'pedido_id' => $pedido->id,
                        'produto_sku' => $produto->sku,
                        'quantidade' => $item['quantidade']
                    ]);
                }

                // Seta quantos já foram sincronizados com esse sku
                $parsedValue = currencyNumbers($item['valor']);
                $cadastrados[$sku][$parsedValue] = (isset($cadastrados[$sku][$parsedValue])) ? ($cadastrados[$sku][$parsedValue] + $item['quantidade']) : $item['quantidade'];

                // Pega os imeis para essa quantidade e tira da lista de imeis disponiveis
                $imeis = [];
                if (isset($produtoImei[$sku]) && !empty($produtoImei[$sku])) {
                    for ($i=0; $i < $item['quantidade']; $i++) {
                        if (isset($produtoImei[$sku][$i])) {
                            $imeis[] = $produtoImei[$sku][$i];
                            unset($produtoImei[$sku][$i]);
                            $produtoImei[$sku] = array_values($produtoImei[$sku]);
                        }
                    }
                }
                $imeis = ($imeis) ? implode(', ', $imeis) : null;

                // Se acabou de ser criado, seta os valores
                if ($pedidoProduto->wasRecentlyCreated) {
                    $pedidoProduto->pedido_id = $pedido->id;
                    $pedidoProduto->produto_sku = $sku;
                    $pedidoProduto->valor = $item['valor'];
                    $pedidoProduto->quantidade = $item['quantidade'];
                } else if ($pedidoProduto->getOriginal('quantidade') < $item['quantidade']) {
                    // Se o pedidoProduto já exisita e tinha menos qtd que na nota, atualiza a qtd
                    $pedidoProduto->quantidade = $item['quantidade'];
                }

                $pedidoProduto->imei = $imeis;

                if ($pedidoProduto->save()) {
                    $utilizados[] = $pedidoProduto->id;
                    Log::info('Pedido Produto importado ' . $sku . ' / ' . $pedido->id);
                } else {
                    Log::warning('Não foi possível importar o Pedido Produto ' . $sku . ' / ' . $pedido->id);
                }
            }
        }

        // Organiza os produtos existentes
        $produtosExistentes = [];
        foreach ($produtosExistentesOriginal as $pedidoProduto) {
            if (!isset($produtosExistentes[$pedidoProduto->produto_sku])) {
                $produtosExistentes[$pedidoProduto->produto_sku] = [];
            }

            $parsedValue = currencyNumbers($pedidoProduto->valor);
            if (isset($produtosExistentes[$pedidoProduto->produto_sku][$parsedValue])) {
                $produtosExistentes[$pedidoProduto->produto_sku][$parsedValue] = $produtosExistentes[$pedidoProduto->produto_sku][$parsedValue] + $pedidoProduto->quantidade;
            } else {
                $produtosExistentes[$pedidoProduto->produto_sku][$parsedValue] = $pedidoProduto->quantidade;
            }
        }

        foreach ($cadastrados as $sku => $valores) {
            foreach ($valores as $valor => $quantidade) {
                if (isset($produtosExistentes[$sku][$valor])) {
                    if ($produtosExistentes[$sku][$valor] > $quantidade) {
                        throw new \Exception("O produto {$sku} deve ter no mínimo {$produtosExistentes[$sku][$valor]} quantidades. A nota possui apenas {$quantidade}.", 7);
                    } else {
                        unset($produtosExistentes[$sku][$valor]);

                        if (isset($produtosExistentes[$sku]) && count($produtosExistentes[$sku]) < 1) {
                            unset($produtosExistentes[$sku]);
                        }
                    }
                }
            }
        }

        // produtosExistentes são pedidoProduto do tucano
        // cadastros são os que estão na nota
        if (!empty($produtosExistentes)) {
            foreach ($produtosExistentes as $sku => $produtosExistente) {
                if (isset($cadastrados[$sku])) {
                    foreach ($produtosExistente as $valor => $qtd) {
                        if (!isset($cadastrados[$sku][$valor])) {
                            throw new \Exception("O valor do produto {$sku} é divergente!", 7);
                        }
                    }
                }
            }

            if (count($produtosExistentes) == 1) {
                throw new \Exception('O produto ' . array_keys($produtosExistentes)[0] . ' está no pedido mas não está na nota!', 7);
            } else {
                throw new \Exception('Os produtos ' . implode(', ', array_keys($produtosExistentes)) . ' estão no pedido mas não estão na nota!', 7);
            }
        }

        /**
         * Envia e-mail de compra
         */
        if ($this->nfe->dest->email) {
            $nome = (string) $this->nfe->dest->xNome;
            $email = (string) $this->nfe->dest->email;
            $nota_id = $nota->id;
            $arquivo = storage_path('app/public/' . date('His') . '.pdf');

            if (\Config::get('core.email_send_enabled')) {
                $mail = Mail::send('emails.compra', [
                    'nome' => $this->nfe->dest->xNome,
                    'produtos' => $produtos,
                    'rastreio' => $rastreio
                ], function($message) use ($nota_id, $email, $nome, $arquivo) {
                    with(new NotaController())->danfe($nota_id, 'F', $arquivo);

                    $message
                        ->attach($arquivo, ['as' => 'nota.pdf', 'mime' => 'application/pdf'])
                        ->to($email)
                        ->subject('Obrigado por comprar na Carioca Celulares On-line');
                });

                if  ($mail) {
                    Log::debug('E-mail com a nota enviado para: ' . $email);
                } else {
                    Log::warning('Falha ao enviar e-mail com a nota para: ' . $email);
                }
            } else {
                Log::debug("O e-mail não foi enviado para {$email} pois o envio está desativado (upload)!");
            }

            unlink($arquivo);
        }

        return true;
    }
}
