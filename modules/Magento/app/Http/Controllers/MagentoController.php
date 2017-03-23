<?php namespace Magento\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use App\Http\Controllers\Controller;
use Core\Models\Produto;
use Core\Models\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Cliente;
use Core\Models\Cliente\Endereco;

/**
 * Class MagentoController
 * @package Magento\Http\Controllers
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
        if (Config::get('magento.enabled')) {
            try {
                $this->api = new \SoapClient(
                    Config::get('magento.api.host'),
                    [
                        'stream_context' => stream_context_create([
                            'http' => [
                                'user_agent' => 'PHPSoapClient'
                            ]
                        ]),
                        'trace'              => true,
                        'exceptions'         => true,
                        'connection_timeout' => 20,
                        'cache_wsdl'         => WSDL_CACHE_NONE
                    ]
                );

                if (is_soap_fault($this->api)) {
                    throw new \Exception('Falha ao tentar fazer conexão soap no magento', 1);
                }

                $this->session = $this->api->login(
                    Config::get('magento.api.user'),
                    Config::get('magento.api.key')
                );
                Log::debug('Requisição soap no magento realizada');
            } catch (\Exception $e) {
                Log::debug('Falha ao tentar fazer conexão soap no magento: ' . $e->getMessage());
            }
        } else {
            Log::debug('Requisição soap no magento foi bloqueada, a integração com o magento está desativada!');
        }
    }

    /**
     * Checa se tem acesso a api do magento
     *
     * @return void
     */
    public function checkApi()
    {
        if (env('APP_ENV') === 'testing')
            return false;

        if (!$this->api || !$this->session) {
            throw new \Exception('Api/sessão não iniciada ou inválida', 1);
        }

        return true;
    }

    /**
     * Retorna o status conforme o state do Magento
     *
     * @param  string $status
     * @return string
     */
    public function parseStatus($status, $reverse = false)
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
     * Retorna o metodo de pagamento após identificar
     *
     * @param  string  $payments
     * @return string
     */
    public function parsePaymentMethod($payments)
    {
        if ($payments) {
            return (strpos($payments, 'ticket') !== false) ? 'boleto' : 'credito';
        }

        return null;
    }

    /**
     * Cria um request na API do Tucanomg
     *
     * @param  string $url
     * @param  array  $params
     * @param  string $method
     * @return array|bool
     */
    public function request($url = null, $params = [], $method = 'GET')
    {
        if ($url === null) {
            return false;
        }

        try {
            Log::debug('Requisição tucanomg para: ' . $url . ', method: ' . $method, $params);

            if (!\Config::get('magento.tucanomg.enabled')) {
                Log::debug('Requisição bloqueada, a integração com o tucanomg está desativada!');
                return null;
            } else {
                $client = new \GuzzleHttp\Client([
                    'base_uri' => \Config::get('magento.tucanomg.host'),
                    'headers'  => [
                        "Accept"         => "application/json",
                        "Content-type"   => "application/json",
                        "X-Access-Token" => \Config::get('magento.tucanomg.token')
                    ]
                ]);

                $r = $client->request($method, $url, $params);

                return json_decode($r->getBody(), true);
            }
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url . ', com o method: ' . $method));

            return false;
        }
    }

    /**
     * Importa um pedido do Magento para o Tucano
     *
     * @param  MagentoPedido $order
     * @return boolean
     */
    public function importPedido($order)
    {
        try {
            $taxvat = preg_replace('/\D/', '', $order['customer']['taxvat']);

            // Customer
            $cliente = Cliente::firstOrNew(['taxvat' => $taxvat]);
            $cliente->tipo  = (strlen($taxvat) > 11) ? 1 : 0;
            $cliente->nome  = $order['customer']['firstname'] . ' ' . $order['customer']['lastname'];
            $cliente->fone  = (isset($order['shipping_address']['fax'])) ? $order['shipping_address']['fax'] : (isset($order['shipping_address']['telephone']) ? $order['shipping_address']['telephone'] : null);
            $cliente->email = isset($order['customer_email']) ? $order['customer_email'] : null;
            if ($cliente->save()) {
                Log::info("Cliente {$cliente->id} importado para o pedido " . $order['increment_id']);
            } else {
                Log::warning("Não foi possivel importar o cliente para o pedido " . $order['increment_id']);
            }

            // Address
            $clienteEndereco = Endereco::firstOrNew([
                'cliente_id' => $cliente->id,
                'cep'        => $order['shipping_address']['postcode']
            ]);

            $endereco = explode("\n", $order['shipping_address']['street']);
            $uf = array_search($order['shipping_address']['region'], \Config::get('core.estados_uf'));

            $clienteEndereco->rua         = (isset($endereco[0])) ? $endereco[0] : null;
            $clienteEndereco->numero      = (isset($endereco[1])) ? $endereco[1] : null;
            $clienteEndereco->bairro      = (isset($endereco[2])) ? $endereco[2] : null;
            $clienteEndereco->complemento = (isset($endereco[3])) ? $endereco[3] : null;
            $clienteEndereco->cidade      = $order['shipping_address']['city'];
            $clienteEndereco->uf          = $uf;
            if ($clienteEndereco->save()) {
                Log::info("Endereço {$clienteEndereco->id} importado para o pedido " . $order['increment_id']);
            } else {
                Log::warning("Não foi possível importar o endereço para o pedido " . $order['increment_id']);
            }

            // Products
            foreach ($order['items'] as $s_produto) {
                $produto = Produto::firstOrCreate(['sku' => $s_produto['sku']]);

                // Importa as informações do produto se não exisitir
                if ($produto->wasRecentlyCreated) {
                    $produto->titulo = $s_produto['name'];
                    if ($produto->save()) {
                        Log::info('Produto ' . $produto->sku . ' importado no pedido ' . $order['increment_id']);
                    } else {
                        Log::warning('Não foi possível importar o produto ' . $produto->sku . ' para o pedido ' . $order['increment_id']);
                    }
                }
            }

            $operacao = ($uf == \Config::get('core.uf'))
                ? \Config::get('core.notas.venda_interna')
                : \Config::get('core.notas.venda_externa');

            // Order transaction
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $pedido = Pedido::firstOrNew([
                'cliente_id'         => $cliente->id,
                'codigo_marketplace' => $order['increment_id']
            ]);

            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->frete_valor         = $order['shipping_amount'];
            $pedido->frete_metodo        = $this->parseShippingMethod($order['shipping_description']);
            $pedido->pagamento_metodo    = $this->parsePaymentMethod($order['payment']['method']);
            $pedido->codigo_marketplace  = $order['increment_id'];
            $pedido->codigo_api          = $order['increment_id'];
            $pedido->marketplace         = 'Site';
            $pedido->operacao            = $operacao;
            $pedido->total               = $order['grand_total'];
            $pedido->created_at          = Carbon::createFromFormat('Y-m-d H:i:s', $order['created_at'])->subHours(3);

            $pedido->status = $this->parseStatus((isset($order['state'])) ? $order['state'] : ((isset($order['status'])) ? $order['status'] : null));

            // Se o status do pedido for pendente, verifica se o mercado pago não rejeitou (salvo em call_for_authorize)
            $cancelOrder = false;
            if ($pedido->status == 0 && isset($order['status_history']) && isset($order['status_history'][0]) && isset($order['status_history'][0]['comment'])) {
                if (strstr($order['status_history'][0]['comment'], 'Status: rejected') !== false && strstr($order['status_history'][0]['comment'], 'cc_rejected_call_for_authorize') === false) {
                    $pedido->status = 5;
                    $cancelOrder = true;
                }
            }

            if (in_array($pedido->status, [1,2,3])) {
                $pedido->estimated_delivery  = $this->calcEstimatedDelivery($order['shipping_description'], $pedido->created_at);
            } else {
                $pedido->estimated_delivery = null;
            }

            if ($pedido->save()) {
                Log::info('Pedido importado ' . $order['increment_id']);

                if ($cancelOrder) {
                    $pedido->status = 5;
                    $pedido->save();
                    Log::notice('O pedido do site foi cancelado (pagamento rejeitado)', [$pedido->id, $order['status_history']]);
                }
            } else {
                Log::warning('Não foi possível importar o pedido ' . $order['increment_id']);
            }

            foreach ($order['items'] as $s_produto) {
                $count = PedidoProduto
                    ::where('pedido_id', '=', $pedido->id)
                    ->where('produto_sku', '=', $s_produto['sku'])
                    ->where('valor', '=', $s_produto['price'])
                    ->count();

                for ($i=0; $i < $s_produto['qty_ordered']; $i++) {
                    if ($count < $s_produto['qty_ordered']) {
                        $pedidoProduto = new PedidoProduto([
                            'pedido_id'   => $pedido->id,
                            'produto_sku' => $s_produto['sku'],
                            'valor'       => $s_produto['price'],
                        ]);

                        if ($pedidoProduto->save()) {
                            $count++;
                            Log::info('PedidoProduto ' . $s_produto['sku'] . ' importado no pedido ' . $order['increment_id']);
                        } else {
                            Log::warning('Não foi possível importar o PedidoProduto ' . $s_produto['sku'] . ' / ' . $order['increment_id']);
                        }
                    } else {
                        Log::info("O produto {$s_produto['sku']} no pedido {$pedido->id} possui {$s_produto['qty_ordered']} quantidades e existem {$count} registrados (não foi criado)");
                    }
                } // for
            }

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            return true;
        } catch (\Exception $e) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::critical(logMessage($e, 'Pedido ' . $order['increment_id'] . ' não importado'), $order);
            reportError('Pedido ' . $order['increment_id'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());

            return false;
        }
    }

    /**
     * Proccess order queue
     * @return void
     */
    public function queue()
    {
        try {
            $order = $this->request('orders');
            if ($order && $this->api) {
                $mg_order = $this->api->salesOrderInfo($this->session, $order['order_id']);
                $mg_order = json_decode(json_encode($mg_order), true);

                if (isset($mg_order['customer_id'])) {
                    $mg_customer = $this->api->customerCustomerInfo($this->session, $mg_order['customer_id']);
                    $mg_customer = json_decode(json_encode($mg_customer), true);

                    if ($mg_order['customer'] = $mg_customer) {
                        $this->importPedido($mg_order);
                    }
                }

                $order = $this->request(sprintf('orders/%s', $order['order_id']), [], 'DELETE');
                Log::notice('Pedido ' . (($mg_order && isset($mg_order['increment_id'])) ? $mg_order['increment_id'] : $order['order_id']) . ' removido da fila de espera no tucanomg.');
            }
        } catch (\Exception $e) {
            if (($e->getCode() == 100 || strstr($e->getMessage(), 'order not exists') !== false) && isset($order['order_id']) && $order['order_id']) {
                $order = $this->request(sprintf('orders/%s', $order['order_id']), [], 'DELETE');
                Log::notice('Pedido ' . ((isset($mg_order) && isset($mg_order['increment_id'])) ? $mg_order['increment_id'] : $order['order_id']) . ' removido da fila de espera no tucanomg (não existe no magento).');
            } else {
                Log::warning('Ocorreu um problema ao tentar executar a fila no mangeto.', [
                    'mg_order' => (isset($mg_order['increment_id']) ? $mg_order['increment_id'] : null),
                    'order' => (isset($order['order_id']) ? $order['order_id'] : null)
                ]);
            }
        }
    }

    /**
     * Importa um pedido especifico sem remover da fila
     *
     * @param  string $order codigo do pedido
     * @return void
     */
    public function syncOrder($order)
    {
        $mg_order = $this->api->salesOrderInfo($this->session, $order);
        $mg_order = json_decode(json_encode($mg_order), true);

        $mg_customer = $this->api->customerCustomerInfo($this->session, $mg_order['customer_id']);
        $mg_customer = json_decode(json_encode($mg_customer), true);

        $mg_order['customer'] = $mg_customer;

        $this->importPedido($mg_order);
    }

    /**
     * Cancela um pedido no Magento
     *
     * @param  Pedido $order pedido a ser cancelado
     * @return void
     */
    public function cancelOrder($order)
    {
        if (!$this->checkApi()) {
            return null;
        }

        try {
            if (!$order->codigo_api) {
                Log::warning("Não foi possível cancelar o pedido {$order->id} no Magento, pois o pedido não possui codigo_api válido");
            } else {
                if ($this->api->salesOrderCancel($this->session, $order->codigo_api)) {
                    Log::notice("Pedido {$order->id} cancelado no magento.");
                } else {
                    Log::warning("Não foi possível cancelar o pedido {$order->id} no Magento");
                }
            }
        } catch (\Exception $e) {
            Log::warning(logMessage($e, "Não foi possível cancelar o pedido {$order->id} no Magento"));
            reportError("Não foi possível cancelar o pedido {$order->id} no Magento" . $e->getMessage() . ' - ' . $e->getLine());
        }
    }

    /**
     * Envia informações de faturamento e envio para o Magento
     *
     * @param  $order      Pedido
     * @return boolean
     */
    public function orderInvoice($order)
    {
        if (!$this->checkApi()) {
            return null;
        }

        $qty      = [];
        $products = [];

        foreach ($order->produtos as $produto) {
            $sku = $produto->produto->sku;
            $products[$sku] = (isset($products[$sku])) ? ($products[$sku] + 1) : 1;
        }

        foreach ($products as $sku => $qtd) {
            $qty[] = [
                'order_item_id' => $sku,
                'qty'           => $qtd,
            ];
        }

        $invoice = $this->createInvoice($order, $qty);
        $shipment = $this->createShipment($order);

        return ($invoice || $shipment);
    }

    /**
     * Cria uma fatura no magento
     *
     * @param  Pedido $order
     * @param  array $qty    quantidade e sku dos produtos
     * @return boolean|null
     */
    protected function createInvoice(Pedido $order, $qty)
    {
        try {
            $request = $this->api->salesOrderInvoiceCreate(
                $this->session,
                $order->codigo_api,
                $qty
            );

            if ($request) {
                Log::notice("Dados de nota atualizados do pedido {$order->id} / {$order->codigo_api} no Magento", [$request]);

                return true;
            }
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Pedido não faturado no Magento (nota)'), ['id' => $order->id, 'codigo_api' => $order->codigo_api]);
            reportError('Pedido não faturado no Magento (nota) ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $order->id);

            return false;
        }

        return null;
    }

    /**
     * Cria um rastreio no Magento
     *
     * @param  Pedido $order
     * @return boolean|null
     */
    protected function createShipment(Pedido $order)
    {
        try {
            $shipmentId = $this->api->salesOrderShipmentCreate(
                $this->session,
                $order->codigo_api
            );

            $request = null;
            $rastreio = $order->rastreios->first();
            if ($shipmentId && $rastreio && $rastreio->rastreio) {
                $request = $this->api->salesOrderShipmentAddTrack(
                    $this->session,
                    $shipmentId,
                    'pedroteixeira_correios',
                    'Correios - ' . $rastreio->servico,
                    $rastreio->rastreio
                );
            }

            if ($shipmentId) {
                Log::notice("Dados de envio atualizados do pedido {$order->id} / {$order->codigo_api} no Magento", [$shipmentId, $request]);

                return true;
            }
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Pedido não faturado no Magento (rastreio)'), ['id' => $order->id, 'codigo_api' => $order->codigo_api]);
            reportError('Pedido não faturado no Magento (rastreio) ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $order->id);

            return false;
        }

        return null;
    }

    /**
     * Send product sku to queue when its stock is changed
     *
     * @param  int $produto_sku
     * @return void
     */
    public function sendProductToQueue($produto_sku)
    {
        try {
            $request = $this->request('products/' . $produto_sku, [], 'POST');
            Log::notice("Produto {$produto_sku} enviado para a fila no tucanomg.");
        } catch (Exception $e) {
            Log::critical(logMessage($e, "Não foi possível enviar o produto {$produto_sku} para a fila no tucanomg."));
            reportError("Não foi possível enviar o produto {$produto_sku} para a fila no tucanomg." . $e->getMessage() . ' - ' . $e->getLine());
        }
    }

    /**
     * Atualiza o estoque no magento
     *
     * @return void
     */
    public function updateStock(Produto $product)
    {
        if (!$this->checkApi()) {
            return null;
        }

        try {
            if (!$product || !$productSku = $product->sku) {
                return $this->notFoundResponse();
            }

            $stock = $this->api->catalogInventoryStockItemUpdate(
                $this->session,
                $productSku,
                [
                    'qty' => $product->estoque,
                    'is_in_stock' => (($product->estoque > 0) ? 1 : 0)
                ]
            );

            if (is_soap_fault($stock)) {
                throw new \Exception('SOAP Fault ao tentar atualizar o stock no magento!', 1);
            }

            if ($stock) {
                Log::notice('Estoque do produto ' . $productSku . ' alterado para ' . $product->estoque . ' / em estoque: ' . (($product->estoque > 0) ? 'sim' : 'não') . ' no magento.');
            } else {
                Log::warning("Estoque do produto {$productSku} não foi atualizado no magento.", (is_array($stock) ? $stock : [$stock]));
            }
        } catch (\Exception $e) {
            Log::critical(logMessage($e, "Erro ao atualizar o estoque do produto {$productSku} no magento."));
            reportError("Erro ao atualizar o estoque do produto {$productSku} no magento." . $e->getMessage() . ' - ' . $e->getLine());
        }
    }

    /**
     * Update product price
     *
     * @param  Produto $product
     * @return boolean
     */
    public function updatePrice(Produto $product)
    {
        if (!$this->checkApi()) {
            return null;
        }

        try {
            if (!$product || !$productSku = $product->sku) {
                return $this->notFoundResponse();
            }

            $stock = $this->api->catalogProductUpdate(
                $this->session,
                $productSku,
                [
                    'price' => $product->valor,
                ],
                null,
                'sku'
            );

            if (is_soap_fault($stock)) {
                throw new \Exception('SOAP Fault ao tentar atualizar o stock no magento!', 1);
            }

            if ($stock) {
                Log::notice('Preco do produto ' . $productSku . ' alterado para ' . $product->valor . ' no magento.');

                return true;
            }
        } catch (\Exception $exception) {
            if ($exception->getCode() == 100 || strstr($exception->getMessage(), 'Product not exist') !== false) {
                Log::debug("Não foi possível atualizar o preço pois o produto {$productSku} não existe no magento.");

                return true;
            } else {
                Log::critical(logMessage($exception, "Erro ao atualizar o preco do produto {$productSku} no magento."));

                return $exception;
            }
        }

        return null;
    }

    /**
     * Remove produto do tucanomg
     *
     * @param  int  $productSku
     * @param  string $message    mensagem adicional ao Log
     * @return void
     */
    public function removeProductFromTucanomg($productSku, $message = false)
    {
        if ($productSku) {
            $remove = $this->request('products/' . $productSku, [], 'DELETE');
            $message = ($message) ? "({$message})" : '';
            Log::notice("Produto {$productSku} removido da fila de espera no tucanomg {$message}");
        }
    }

    /**
     * Calcula a estimativa de entrega do pedido
     *
     * @param  string $shippingDescription string do magento com a previsão em dias
     * @param  string $orderDate           data que o pedido foi realizado
     * @return string                      data estimada no formato Y-m-d
     */
    public function calcEstimatedDelivery($shippingDescription, $orderDate)
    {
        if (!$shippingDescription) {
            return null;
        }

        $estimate = (int)preg_replace('/\D/', '', $shippingDescription);
        $estimate = SomaDiasUteis(Carbon::createFromFormat('Y-m-d H:i:s', $orderDate)->format('d/m/Y'), $estimate);

        return Carbon::createFromFormat('d/m/Y', $estimate)->format('Y-m-d');
    }

    public function syncPrices()
    {
        try {
            $products = $this->api->catalogProductList($this->session);
            $count    = 0;

            foreach ($products as $mgProduct) {
                if ($product = Produto::find($mgProduct->sku)) {
                    $product->valor = $mgProduct->price;

                    if ($product->save()) {
                        $count++;
                    }
                }
            }

            Log::info($count . ' de ' . count($products) . ' precos foram sincronizados do magento para o tucano!');

            return $count . ' de ' . count($products) . ' importados!';
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao sincronizar os precos do magento para o tucano'));
        }

        return 'Ocorreu um problema, consulte os logs!';
    }

    /**
     * Sincroniza os produtos do magento para o tucano
     *
     * @return void
     */
    public function syncProducts()
    {
        try {
            $result = $this->api->catalogProductList($this->session);

            $count = 0;
            foreach ($result as $product) {
                $produto         = Produto::firstOrNew(['sku' => $product->sku]);
                $produto->sku    = $product->sku;
                $produto->titulo = $product->name;

                if ($produto->save()) {
                    $count++;
                }
            }

            Log::info($count . ' de ' . count($result) . ' produtos foram sincronizados do magento para o tucano!');
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Erro ao sincronizar os produtos do magento para o tucano'));
            reportError('Erro ao sincronizar os produtos do magento para o tucano' . $e->getMessage() . ' - ' . $e->getLine());
        }
    }

    /**
     * Create product in Magento
     *
     * @param  array  $data Product parameters
     * @return boolean
     */
    public function createProduct(array $data)
    {
        try {
            $product = $this->api->catalogProductCreate($this->session, 'simple', 10, $data['sku'], [
                'categories'            => [2],
                'websites'              => [1],
                'name'                  => $data['title'],
                'description'           => $data['description'],
                'short_description'     => $data['title'],
                'weight'                => $data['weight'],
                'status'                => '2',
                'visibility'            => '4',
                'price'                 => $data['cost'],
                'tax_class_id'          => 0,
                'additional_attributes' => [
                    'single_data' => [
                        [
                            'key'   => 'ean',
                            'value' => $data['ean']
                        ],
                        [
                            'key'   => 'volume_altura',
                            'value' => max($data['height'], 2),
                        ],
                        [
                            'key'   => 'volume_largura',
                            'value' => max($data['width'], 11),
                        ],
                        [
                            'key'   => 'volume_comprimento',
                            'value' => max($data['length'], 16),
                        ],
                        [
                            'key'   => 'dimensoes_desc',
                            'value' => implode(' x ', [
                                round($data['height'], 1),
                                round($data['width'], 1),
                                round($data['length'], 1)]
                            ) . 'cm'
                        ],
                        [
                            'key'   => 'garantia',
                            'value' => array_key_exists('warranty', $data) ? $data['warranty'] : ''
                        ],
                        [
                            'key'   => 'subtitle',
                            'value' => array_key_exists('subtitle', $data) ? $data['subtitle'] : ''
                        ],
                        [
                            'key'   => 'cor',
                            'value' => array_key_exists('cor', $data) ? $data['cor'] : ''
                        ]
                    ]
                ]
            ]);

            $images = explode("\n", $data['images']);

            foreach ($images as $key => $imageUrl) {
                $file = [
                    'content' => base64_encode(file_get_contents($imageUrl)),
                    'mime'    => 'image/jpeg'
                ];

                $result = $this->api->catalogProductAttributeMediaCreate($this->session, $product, [
                    'file'     => $file,
                    'label'    => $data['title'],
                    'position' => $key,
                    'types'    => ($key == 0) ? ['image', 'thumbnail', 'small_image', 'rotator_image'] : [],
                    'exclude'  => 0
                ]);
            }
        } catch (\Exception $exception) {
            Log::error(logMessage($exception, 'Não foi possível criar o produto no magento!'));
        }
    }
}
