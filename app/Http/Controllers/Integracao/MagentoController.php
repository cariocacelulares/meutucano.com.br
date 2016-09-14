<?php namespace App\Http\Controllers\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\PedidoProduto;
use App\Models\Produto\Produto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Class MagentoController
 * @package App\Http\Controllers
 */
class MagentoController extends Controller
{
    /**
     * @var SoapClient
     */
    protected $api;

    /**
     * Sessão de autenticação no magento
     * @var SoapSession
     */
    protected $session;

    /**
     * Cria a variável de integração com o Magento
     *
     * @return void
     */
    public function __construct()
    {
        try {
            $this->api     = new \SoapClient(\Config::get('tucano.magento.api.host'), ['cache_wsdl' => WSDL_CACHE_NONE]);
            $this->session = $this->api->login(
                \Config::get('tucano.magento.api.user'),
                \Config::get('tucano.magento.api.key')
            );
            Log::info('Requisição soap no magento realizada');
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Falha ao tentar realizar uma requisição soap no magento'));
            return false;
        }
    }

    /**
     * Retorna o status conforme o state do Magento
     *
     * @param  string $status
     * @return string
     */
    protected function parseMagentoStatus($status, $reverse = false)
    {
        $statusConvert = [
            'new'             => 0,
            'pending'         => 0,
            'pending_payment' => 0,
            'processing'      => 1,
            'complete'        => 2,
            'canceled'        => 5,
            'closed'          => 5
        ];

        return (!$reverse) ? (isset($statusConvert[$status]) ? $statusConvert[$status] : 0) : array_search($status, $statusConvert);
    }

    /**
     * Retorna o metodo de frete após identificar
     *
     * @param  string  $shipping
     * @return string
     */
    public function parseShippingMethod($shipping)
    {
        if (!$shipping) {
            return null;
        }

        $shipping = mb_strtolower($shipping);

        if (strpos($shipping, 'pac') !== false) {
            return 'pac';
        } elseif (strpos($shipping, 'sedex') !== false) {
            return 'sedex';
        } else {
            return 'outro';
        }
    }

    /**
     * Cria um request na API do Tucanomg
     *
     * @param  string $url
     * @param  array  $params
     * @param  string $method
     * @return array
     */
    private function request($url = null, $params = [], $method = 'GET')
    {
        if ($url === null)
            return false;

        try {
            Log::info('Requisição tucanomg para: ' . $url . ', method: ' . $method, $params);
            $client = new \GuzzleHttp\Client([
                'base_uri' => \Config::get('tucano.services.tucanomg.host'),
                'headers' => [
                    "Accept"         => "application/json",
                    "Content-type"   => "application/json",
                    "X-Access-Token" => \Config::get('tucano.services.tucanomg.token')
                ]
            ]);

            $r = $client->request($method, $url, $params);

            return json_decode($r->getBody(), true);
        } catch (Guzzle\Http\Exception\BadResponseException $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url . ', com o method: ' . $method));
            return false;
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url . ', com o method: ' . $method));
            return false;
        }
    }

    /**
     * Importa um pedido do Magento para o Tucano
     *
     * @param  MagentoPedido $mg_order
     * @return string|boolean
     */
    public function importPedido($mg_order) {
        try {
            $taxvat = preg_replace('/\D/', '', $mg_order['customer']['taxvat']);

            $cliente        = Cliente::firstOrNew(['taxvat' => $taxvat]);
            $cliente->tipo  = (strlen($taxvat) > 11) ? 1 : 0;
            $cliente->nome  = $mg_order['customer']['firstname'] . ' ' . $mg_order['customer']['lastname'];
            $cliente->fone  = (isset($mg_order['shipping_address']['fax'])) ? $mg_order['shipping_address']['fax'] : $mg_order['shipping_address']['telephone'];
            $cliente->email = $mg_order['customer_email'];
            $cliente->save();
            Log::info("Cliente {$cliente->id} importado para o pedido " . $mg_order['increment_id']);

            $clienteEndereco = Endereco::firstOrNew([
                'cliente_id' => $cliente->id,
                'cep'        => $mg_order['shipping_address']['postcode']
            ]);

            $endereco = explode("\n", $mg_order['shipping_address']['street']);
            $uf       = array_search($mg_order['shipping_address']['region'], \Config::get('tucano.estados_uf'));

            $clienteEndereco->rua         = (isset($endereco[0])) ? $endereco[0] : null;
            $clienteEndereco->numero      = (isset($endereco[1])) ? $endereco[1] : null;
            $clienteEndereco->bairro      = (isset($endereco[2])) ? $endereco[2] : null;
            $clienteEndereco->complemento = (isset($endereco[3])) ? $endereco[3] : null;
            $clienteEndereco->cidade      = $mg_order['shipping_address']['city'];
            $clienteEndereco->uf          = $uf;
            $clienteEndereco->save();
            Log::info("Endereço {$clienteEndereco->id} importado para o pedido " . $mg_order['increment_id']);

            foreach ($mg_order['items'] as $s_produto) {
                $produto = Produto::firstOrCreate(['sku' => $s_produto['sku']]);

                // Importa as informações do produto se não exisitir
                if ($produto->wasRecentlyCreated) {
                    $produto->titulo = $s_produto['name'];
                    $produto->save();
                    Log::info('Produto ' . $produto->sku . ' importado no pedido ' . $mg_order['increment_id']);
                }
            }

            $operacao    = ($uf == \Config::get('tucano.uf'))
                ? \Config::get('tucano.venda_interna')
                : \Config::get('tucano.venda_externa');

            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $pedido = Pedido::firstOrCreate([
                'cliente_id'          => $cliente->id,
                'cliente_endereco_id' => $clienteEndereco->id,
                'codigo_marketplace'  => $mg_order['increment_id']
            ]);

            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->frete_valor         = $mg_order['shipping_amount'];
            $pedido->frete_metodo        = $this->parseShippingMethod($mg_order['shipping_description']);
            $pedido->pagamento_metodo    = (strpos($mg_order['payment']['method'], 'ticket') !== false) ? 'boleto' : 'credito';
            $pedido->codigo_marketplace  = $mg_order['increment_id'];
            $pedido->codigo_api          = $mg_order['increment_id'];
            $pedido->marketplace         = 'Site';
            $pedido->operacao            = $operacao;
            $pedido->total               = $mg_order['subtotal'];
            $pedido->status              = $this->parseMagentoStatus((isset($mg_order['state'])) ? $mg_order['state'] : ((isset($mg_order['status'])) ? $mg_order['status'] : null ));
            $pedido->created_at          = Carbon::createFromFormat('Y-m-d H:i:s', $mg_order['created_at'])->subHours(3);

            if (!$pedido->wasRecentlyCreated) {
                if (($pedido->status !=  $pedido->getOriginal('status')) && $pedido->status == 5) {
                    if (in_array($pedido->getOriginal('status'), [1, 2])) {
                        $pedido->reembolso = true;
                    }
                }
            }

            foreach ($mg_order['items'] as $s_produto) {
                $pedidoProduto = PedidoProduto::firstOrCreate([
                    'pedido_id'   => $pedido->id,
                    'produto_sku' => $s_produto['sku'],
                    'valor'       => $s_produto['row_total'],
                    'quantidade'  => $s_produto['qty_ordered']
                ]);
                $pedidoProduto->save();
                Log::info('PedidoProduto ' . $s_produto['sku'] . ' importado no pedido ' . $mg_order['increment_id']);
            }

            $this->updateStockData($mg_order, $pedido);

            $pedido->save();
            Log::info('Pedido importado ' . $mg_order['increment_id']);

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            return sprintf('Pedido %s importado', $mg_order['increment_id']);
        } catch (\Exception $e) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::critical(logMessage($e, 'Pedido ' . $mg_order['increment_id'] . ' não importado'), $mg_order);
            $error = 'Pedido ' . $mg_order['increment_id'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine();

            Mail::send('emails.error', [
                'error' => $error
            ], function ($m) {
                $m->from('dev@cariocacelulares.com.br', 'Meu Tucano');
                $m->to('dev.cariocacelulares@gmail.com', 'DEV')->subject('Erro no sistema!');
            });

            return false;
        }
    }

    /**
     * Proccess order queue
     * @return void
     */
    public function queue()
    {
        $order = $this->request('orders');
        if ($order) {
            $mg_order = $this->api->salesOrderInfo($this->session, $order['order_id']);
            $mg_order = json_decode(json_encode($mg_order), true);

            $mg_customer = $this->api->customerCustomerInfo($this->session, $mg_order['customer_id']);
            $mg_customer = json_decode(json_encode($mg_customer), true);

            $mg_order['customer'] = $mg_customer;

            if ($mg_order) {
                if ($this->importPedido($mg_order)) {
                    $order = $this->request(sprintf('orders/%s', $order['order_id']), [], 'DELETE');
                    Log::info('Pedido ' . $mg_order['increment_id'] . ' removido da fila de espera.');
                }
            }
        }
    }

    /**
     * Update stock data from Magento
     *
     * @param  MagentoOrder $mg_order
     * @param  Pedido $pedido
     * @return boolean
     */
    protected function updateStockData($mg_order, $pedido)
    {
        try {
            $oldStatus = null;
            $wasRecentlyCreated = $pedido->wasRecentlyCreated;
            if (!$wasRecentlyCreated) {
                $oldStatus = $pedido->getOriginal('status');
                $oldStatus = ($oldStatus || $oldStatus === 0) ? $oldStatus : null;
            }

            foreach ($mg_order['items'] as $s_produto) {
                $produto = Produto::find($s_produto['sku']);

                if (!$produto)
                    continue;

                $oldEstoque = $produto->estoque;

                if (!$wasRecentlyCreated) {
                    if (($pedido->status != $oldStatus) && $pedido->status == 5) {
                        $produto->estoque = $oldEstoque + (int)(($s_produto['qty_canceled']) ? $s_produto['qty_ordered'] : $s_produto['qty_ordered']);
                    }
                } elseif ($pedido->status != 5) {
                    $produto->estoque = $oldEstoque - (int)$s_produto['qty_ordered'];
                }

                $produto->save();

                if ($oldEstoque != $produto->estoque) {
                    Log::notice("Estoque do produto {$s_produto['sku']} alterado de {$oldEstoque} para {$produto->estoque}.");
                } else {
                    Log::info("Estoque do produto {$s_produto['sku']} não sofreu alterações: {$produto->estoque}.");
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Não foi possível alterar estoque de um ou mais produtos do pedido ' . $mg_order['increment_id'] . ' no tucano'), $mg_order['items']);
            $error = 'Não foi possível alterar estoque no tucano: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $mg_order;

            Mail::send('emails.error', [
                'error' => $error
            ], function ($m) {
                $m->from('dev@cariocacelulares.com.br', 'Meu Tucano');
                $m->to('dev.cariocacelulares@gmail.com', 'DEV')->subject('Erro no sistema!');
            });
            return false;
        }
    }

    /**
     * Send product sku to queue when its stock is changed
     * @param  int $produto_sku
     * @return void
     */
    public function sendProductToQueue($produto_sku)
    {
        try {
            $request = $this->request('products/' . $produto_sku, [], 'POST');

            if ($request)
                Log::notice("Produto {$produto_sku} enviado para a fila.");
        } catch (Exception $e) {
            Log::warning(logMessage($e, "Não foi possível enviar o produto {$produto_sku} para a fila."));
            return $e->getMessage();
        }
    }

    public function updateStock()
    {
        try {
            $product = $this->request('products');

            if ($product && $product['product_sku'])
                $product = Produto::find($product['product_sku']);

            if ($product) {
                $stock = $this->api->catalogInventoryStockItemUpdate(
                    $this->session,
                    $product->sku,
                    [
                        'qty' => $product->estoque,
                        'is_in_stock' => (($product->estoque > 0) ? 1 : 0)
                    ]
                );

                if ($stock) {
                    Log::notice('Estoque do produto ' . $product->sku . ' alterado para ' . $product->estoque . ' / em estoque: ' . (($product->estoque > 0) ? 'sim' : 'não'));

                    $remove = $this->request('products/' . $product->sku, [], 'DELETE');
                    if ($remove)
                        Log::notice("Produto {$product->sku} removido da fila de espera");
                } else {
                    Log::warning("Estoque do produto {$product->sku} não foi atualizado", (is_array($stock) ? $stock : [$stock]));
                }
            }
        } catch (Exception $e) {
            Log::warning(logMessage($e, "Atualizar o estoque do produto {$produto_sku} no magento."));
            return $e->getMessage();
        }
    }

    /**
     * Cancela pedidos com mais de 7 dias úteis de pagamento pendente
     *
     * @return void
     */
    public function cancelOldOrders()
    {
        try {
            $pedidos = Pedido::where('status', '=', 0)->whereNotNull('codigo_api')->where('marketplace', '=', 'Site')->get();

            foreach ($pedidos as $pedido) {
                $dataPedido = Carbon::createFromFormat('d/m/Y H:i', $pedido->created_at)->format('d/m/Y');

                if (diasUteisPeriodo($dataPedido, date('d/m/Y'), true) > 7) {
                    $pedido->status = 5;
                    $pedido->save();

                    foreach ($pedido->produtos as $pedidoProduto) {
                        $produto = $pedidoProduto->produto;
                        $oldEstoque = $produto->estoque;
                        $produto->estoque = $oldEstoque - $pedidoProduto->quantidade;
                        $produto->save();
                        Log::notice("Estoque do produto {$produto->sku} foi alterado de {$oldEstoque} para {$produto->estoque}");
                    }

                    if ($cancel = $this->api->salesOrderCancel($this->session, $pedido->codigo_api)) {
                        Log::info("Pedido {$pedido->id} cancelado.");
                    } else {
                        Log::warning("Não foi possível cancelar o pedido antigo {$pedido->id}");
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::error(logMessage($e, 'Não foi possível cancelar o pedido no Magento'));
            return false;
        }
    }
}