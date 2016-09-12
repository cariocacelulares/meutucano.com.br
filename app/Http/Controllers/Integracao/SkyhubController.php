<?php namespace App\Http\Controllers\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\PedidoProduto;
use App\Models\Produto\Produto;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Class SkyhubController
 * @package App\Http\Controllers\Integracao
 */
class SkyhubController extends Controller
{
    public function teste($order)
    {
        $s_pedido = $this->request("/orders/{$order}");

        if ($s_pedido) {
            if ($this->importPedido($s_pedido)) {
                Log::info('Pedido ' . $s_pedido['code'] . ' removido da fila de espera.');
            }
        }
    }

    /**
     * Formata o ID do pedido no marketplace
     *
     * @param  string  $marketplace
     * @param  id      $pedidoId
     * @return string
     */
    public function parseMarketplaceId($marketplace = null, $pedidoId)
    {
        if ($marketplace === 'B2W') {
            if (substr($pedidoId, 0, 1) !== '0') {
                $inicio = substr($pedidoId, 0, 2);

                if ($inicio === '10') {
                    $inicioId = '01';
                    $posSub   = 2;
                } else {
                    $inicioId = '0' . substr($pedidoId, 0, 1);
                    $posSub   = 1;
                }

                $fim = substr($pedidoId, $posSub, -2);

                return $inicioId . '-' . $fim;
            }
        } elseif ($marketplace === 'WALMART') {
            return substr($pedidoId, 0, strpos($pedidoId, '-'));
        }

        return $pedidoId;
    }

    /**
     * Formata o nome do marketplace
     *
     * @param string $pedidoCode
     * @return string
     */
    public function parseMarketplaceName($pedidoCode)
    {
        $pedidoCode = strtolower(str_replace(' ', '', $pedidoCode));

        if (
            (strpos($pedidoCode, 'americanas') !== false) ||
            (strpos($pedidoCode, 'submarino') !== false) ||
            (strpos($pedidoCode, 'shoptime') !== false) ||
            (strpos($pedidoCode, 'barato') !== false)
        ) {
            return 'B2W';
        } elseif (
            (strpos($pedidoCode, 'extra') !== false) ||
            (strpos($pedidoCode, 'pontofrio') !== false) ||
            (strpos($pedidoCode, 'bahia') !== false) ||
            (strpos($pedidoCode, 'discount') !== false)
        ) {
            return 'CNOVA';
        } elseif (
            (strpos($pedidoCode, 'walmart') !== false)
        ) {
            return 'WALMART';
        } elseif (
            (strpos($pedidoCode, 'mercado') !== false)
        ) {
            return 'MERCADOLIVRE';
        }

        return 'SITE';
    }

    /**
     * Retorna o status do tucano baseado no status do marketplace
     *
     * @param  string  $status
     * @param  boolean $reverse Caso true, retorna o status no marketplace
     * @return int|string
     */
    public function parseMarketplaceStatus($status, $reverse = false)
    {
        $statusConvert = [
            'NEW'       => 0,
            'APPROVED'  => 1,
            'SHIPPED'   => 2,
            'DELIVERED' => 3,
            'CANCELED'  => 5
        ];

        return (!$reverse) ? $statusConvert[$status] : array_search($status, $statusConvert);
    }

    /**
     * Retorna o metodo de pagamento após identificar
     *
     * @param  string  $payments
     * @return string
     */
    public function parsePaymentMethod($payments)
    {
        if (is_array($payments) && !empty($payments) && isset($payments[0]['method'])) {
            $method = $payments[0]['method'];
        } else {
            return null;
        }

        $method = mb_strtolower($method);

        if (strpos($method, 'debit') !== false) {
            return 'debito';
        } elseif (strpos($method, 'credit') !== false) {
            return 'credito';
        } elseif (strpos($method, 'boleto') !== false) {
            return 'boleto';
        } else {
            return 'outro';
        }
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
            return 'PAC';
        } elseif (strpos($shipping, 'sedex') !== false) {
            return 'SEDEX';
        } else {
            return 'outro';
        }
    }

    /**
     * Cria um request na API do Skyhub
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
            Log::info('Requisição skyhub para: ' . $url, $params);
            $client = new Client([
                'base_uri' => \Config::get('tucano.skyhub.api.url'),
                'headers' => [
                    "Accept"       => "application/json",
                    "Content-type" => "application/json",
                    "X-User-Email" => \Config::get('tucano.skyhub.api.email'),
                    "X-User-Token" => \Config::get('tucano.skyhub.api.token')
                ]
            ]);

            $r = $client->request($method, $url, $params);

            return json_decode($r->getBody(), true);
        } catch (Guzzle\Http\Exception\BadResponseException $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url));
            return $e->getMessage();
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url));
            return $e->getMessage();
        }
    }

    /**
     * Importa um pedido da Skyhub para o Tucano
     *
     * @param  SkyhubPedido $s_pedido
     * @return string|boolean
     */
    public function importPedido($s_pedido) {
        try {
            $clienteFone = (sizeof($s_pedido['customer']['phones']) > 1)
                ? $s_pedido['customer']['phones'][1]
                : $s_pedido['customer']['phones'][0];

            $cliente = Cliente::firstOrNew(['taxvat' => $s_pedido['customer']['vat_number']]);
            $cliente->tipo = (strlen($s_pedido['customer']['vat_number']) > 11) ? 1 : 0;
            $cliente->nome = $s_pedido['customer']['name'];
            $cliente->fone = '(' . substr($clienteFone, 0, 2) . ')' . substr($clienteFone, 2, 5) . '-' . substr($clienteFone, 7);
            $cliente->save();
            Log::info("Cliente {$cliente->id} importado para o pedido " . $s_pedido['code']);

            $clienteEndereco = Endereco::firstOrNew([
                'cliente_id' => $cliente->id,
                'cep'        => $s_pedido['shipping_address']['postcode']
            ]);
            $clienteEndereco->rua         = $s_pedido['shipping_address']['street'];
            $clienteEndereco->numero      = $s_pedido['shipping_address']['number'];
            $clienteEndereco->complemento = $s_pedido['shipping_address']['detail'];
            $clienteEndereco->bairro      = $s_pedido['shipping_address']['neighborhood'];
            $clienteEndereco->cidade      = $s_pedido['shipping_address']['city'];
            $clienteEndereco->uf          = $s_pedido['shipping_address']['region'];
            $clienteEndereco->save();
            Log::info("Endereço {$clienteEndereco->id} importado para o pedido " . $s_pedido['code']);

            foreach ($s_pedido['items'] as $s_produto) {
                $produto = Produto::firstOrCreate(['sku' => $s_produto['product_id']]);

                // Importa as informações do produto se não exisitir
                if ($produto->wasRecentlyCreated) {
                    $produto->titulo = $s_produto['name'];
                    $produto->save();
                    Log::info('Produto ' . $s_produto['product_id'] . ' importado no pedido ' . $s_pedido['code']);
                }
            }

            $marketplace = $this->parseMarketplaceName($s_pedido['code']);
            $operacao    = ($s_pedido['shipping_address']['region'] == \Config::get('tucano.uf'))
                ? \Config::get('tucano.venda_interna')
                : \Config::get('tucano.venda_externa');

            $codMarketplace = $this->parseMarketplaceId(
                $marketplace,
                substr($s_pedido['code'], strpos($s_pedido['code'], '-') + 1)
            );

            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $pedido = Pedido::firstOrCreate([
                'cliente_id'          => $cliente->id,
                'cliente_endereco_id' => $clienteEndereco->id,
                'codigo_marketplace'  => $codMarketplace
            ]);

            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->codigo_api          = $s_pedido['code'];
            $pedido->frete_valor         = $s_pedido['shipping_cost'];
            $pedido->frete_metodo        = $this->parseShippingMethod($s_pedido['shipping_method']);
            $pedido->pagamento_metodo    = $this->parsePaymentMethod($s_pedido['payments']);
            $pedido->codigo_marketplace  = $codMarketplace;
            $pedido->marketplace         = $marketplace;
            $pedido->operacao            = $operacao;
            $pedido->total               = $s_pedido['total_ordered'];
            $pedido->estimated_delivery  = substr($s_pedido['estimated_delivery'], 0, 10);
            $pedido->status              = $this->parseMarketplaceStatus($s_pedido['status']['type']);
            $pedido->created_at          = substr($s_pedido['placed_at'], 0, 10) . ' ' . substr($s_pedido['placed_at'], 11, 8);

            foreach ($s_pedido['items'] as $s_produto) {
                $pedidoProduto = PedidoProduto::firstOrCreate([
                    'pedido_id'   => $pedido->id,
                    'produto_sku' => $s_produto['product_id'],
                    'valor'       => $s_produto['special_price'],
                    'quantidade'  => $s_produto['qty']
                ]);
                $pedidoProduto->save();
                Log::info('PedidoProduto ' . $s_produto['product_id'] . ' importado no pedido ' . $s_pedido['code']);
            }

            $this->updateStockData($s_pedido, $pedido);

            $pedido->save();
            Log::info('Pedido importado ' . $s_pedido['code']);

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            $this->request(
                sprintf('/orders/%s/exported', $s_pedido['code']),
                ['json' => [
                    "exported" => true
                ]],
                'PUT'
            );

            Log::info('Pedido importado', $s_pedido);
            return sprintf('Pedido %s importado', $s_pedido['code']);
        } catch (\Exception $e) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::critical(logMessage($e, 'Pedido ' . $s_pedido['code'] . ' não importado'), $s_pedido);
            $error = 'Pedido ' . $s_pedido['code'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine();

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
     * Atualiza todos status dos pedidos da Skyhub
     *
     * @return void
     */
    public function updateAllStatuses()
    {
        $pedidos = Pedido::whereNotNull('codigo_api')->get();
        foreach ($pedidos as $pedido) {
            $oldStatus          = $pedido->status;
            $s_pedido           = $this->request('/orders/' . $pedido['codigo_skyhub']);

            $pedido->status     = $this->parseMarketplaceStatus($s_pedido['status']['type']);
            $pedido->created_at = substr($s_pedido['placed_at'], 0, 10) . ' ' . substr($s_pedido['placed_at'], 11, 8);

            if ($pedido->rastreio) {
                if ($pedido->rastreio->status == 4) {
                    $pedido->status = 3;
                }
            }

            $pedido->save();
            Log::info("Status do pedido {$pedido->id} atualizado de {$oldStatus} para {$pedido->status}.");

            if ($pedido->rastreio) {
                if ($pedido->rastreio->status == 4) {
                    $this->refreshStatus($pedido);
                }
            }
        }
    }

    /**
     * Update stock data from Skyhub
     *
     * @param  SkyhubPedido $s_pedido
     * @param  Pedido $pedido
     * @return boolean
     */
    protected function updateStockData($s_pedido, $pedido)
    {
        try {
            $oldStatus = null;
            $wasRecentlyCreated = $pedido->wasRecentlyCreated;
            if (!$wasRecentlyCreated) {
                $oldStatus = $pedido->getOriginal('status');
                $oldStatus = ($oldStatus || $oldStatus === 0) ? $oldStatus : null;
            }

            foreach ($s_pedido['items'] as $s_produto) {
                $produto =  Produto::find($s_produto['product_id']);

                if (!$produto)
                    continue;

                $oldEstoque = $produto->estoque;

                if (!$wasRecentlyCreated) {
                    if (($pedido->status != $oldStatus) && $pedido->status == 5) {
                        $produto->estoque = $oldEstoque + $s_produto['qty'];
                    }
                } elseif ($pedido->status != 5) {
                    $produto->estoque = $oldEstoque - $s_produto['qty'];
                }

                $produto->save();

                if ($oldEstoque != $produto->estoque) {
                    Log::info("Estoque do produto {$s_produto['product_id']} alterado de {$oldEstoque} para {$produto->estoque}.");
                } else {
                    Log::info("Estoque do produto {$s_produto['product_id']} não sofreu alterações: {$produto->estoque}.");
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Não foi possível alterar estoque de um ou mais produtos do pedido ' . $s_pedido['code'] . ' no tucano'), $s_pedido['items']);
            $error = 'Não foi possível alterar estoque no tucano: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $s_pedido;

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
     * Importa todos pedidos não sincronizados
     *
     * @return void
     */
    public function getPedidos()
    {
        $pedidos = $this->request('/orders?per_page=100&filters[sync_status][]=NOT_SYNCED');

        if ($pedidos) {
            foreach ($pedidos['orders'] as $s_pedido) {
                $this->importPedido($s_pedido);
            }
        }
    }

    /**
     * Importa último pedido da fila de integração
     *
     * @return void
     */
    public function queue()
    {
        $s_pedido = $this->request('/queues/orders');

        if ($s_pedido) {
            if ($this->importPedido($s_pedido)) {
                $this->request(
                    sprintf('/queues/orders/%s', $s_pedido['code']),
                    [],
                    'DELETE'
                );

                Log::info('Pedido ' . $s_pedido['code'] . ' removido da fila de espera.');
            }
        }
    }

    /**
     * Envia informações de faturamento e envio para skyhub
     *
     * @param  $id      Order id
     * @return boolean
     */
    public function orderInvoice($id)
    {
        if ($pedido = Pedido::find($id)) {

            try {
                if (\Config::get('tucano.skyhub.enabled')) {
                    foreach ($pedido->produtos as $produto) {
                        $jsonItens[] = [
                            "sku" => $produto->produto->sku,
                            "qty" => $produto->quantidade
                        ];
                    }

                    $jsonData = [
                        "shipment" => [
                            "code"  => $pedido->rastreios->first()->rastreio,
                            "items" => $jsonItens,
                            "track" => [
                                "code"    => $pedido->rastreios->first()->rastreio,
                                "carrier" => "CORREIOS",
                                "method"  => $pedido->rastreios->first()->servico
                            ]
                        ],
                        "invoice" => [
                            "key" => $pedido->nota->chave
                        ]
                    ];

                    $this->request(
                        sprintf('/orders/%s/shipments', $pedido->codigo_api),
                        ['json' => $jsonData],
                        'POST'
                    );

                    Log::info("Dados de envio e nota fiscal atualizados do pedido {$pedido->id} / {$pedido->codigo_skyhub}", $jsonData);
                }

                return true;

            } catch (\Exception $e) {
                Log::critical(logMessage($e, 'Pedido não faturado'), ['id' => $pedido->id, 'codigo_skyhub' => $pedido->codigo_skyhub]);
                $error = 'Pedido não faturado: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $pedido;

                Mail::send('emails.error', [
                    'error' => $error
                ], function ($m) {
                    $m->from('dev@cariocacelulares.com.br', 'Meu Tucano');
                    $m->to('dev.cariocacelulares@gmail.com', 'DEV')->subject('Erro no sistema!');
                });
                return false;
            }
        }
    }

    /**
     * Marca um pedido como entregue na Skyhub
     *
     * @param  Pedido $pedido
     * @return boolean
     */
    public function refreshStatus($pedido)
    {
        try {
            if (\Config::get('tucano.skyhub.enabled')) {
                switch ($pedido->status) {
                    case 3: {
                        $this->request(
                            sprintf('/orders/%s/delivery', $pedido->codigo_api),
                            [],
                            'POST'
                        );
                        Log::info("Pedido {$pedido->id} / {$pedido->skyhub} alterado para enviado.");
                        break;
                    }
                    case 5: {
                        $this->request(
                            sprintf('/orders/%s/cancel', $pedido->codigo_api),
                            [],
                            'POST'
                        );
                        Log::info("Pedido {$pedido->id} / {$pedido->skyhub} cancelado.");
                        break;
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Não foi possível alterar o status do pedido na Skyhub'), ['id' => $pedido->id, 'codigo_skyhub' => $pedido->codigo_skyhub]);
            $error = 'Não foi possível alterar o status do pedido na Skyhub: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $pedido;

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
     * Cancela pedidos com mais de 3 dias úteis de pagamento pendente
     *
     * @return void
     */
    public function cancelOldOrders()
    {
        try {
            $pedidos = Pedido::where('status', '=', 0)->get();

            $cancelados = 0;
            foreach ($pedidos as $pedido) {
                $dataPedido = Carbon::createFromFormat('Y-m-d H:i:s', $pedido->created_at)->format('d/m/Y');

                if (diasUteisPeriodo($dataPedido, date('d/m/Y'), true) > 4) {
                    $pedido->status = 5;
                    $pedido->save();

                    with(new SkyhubController())->refreshStatus($pedido);

                    $cancelados++;
                }
            }

            return sprintf('%s pedido(s) cancelado(s) na Skyhub', $cancelados);
        } catch (\Exception $e) {
            Log::error(logMessage($e, 'Não foi possível cancelar o pedido na Skyhub'));
            return false;
        }
    }
}