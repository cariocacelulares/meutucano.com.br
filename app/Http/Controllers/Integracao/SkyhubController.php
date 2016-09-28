<?php namespace App\Http\Controllers\Integracao;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Integracao\Integracao;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\PedidoProduto;
use App\Models\Produto\Produto;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Class SkyhubController
 * @package App\Http\Controllers\Integracao
 */
class SkyhubController extends Controller implements Integracao
{
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
    public function parseStatus($status, $reverse = false)
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
     * Cria um request na API do Skyhub
     *
     * @param  string $url
     * @param  array  $params
     * @param  string $method
     * @return array
     */
    public function request($url = null, $params = [], $method = 'GET')
    {
        if ($url === null)
            return false;

        try {
            Log::debug('Requisição skyhub para: ' . $url . ', method: ' . $method, $params);

            if (!\Config::get('tucano.skyhub.enabled')) {
                Log::debug('Requisição bloqueada, a integração com o skyhub está desativada!');
                return null;
            } else {
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
            }
        } catch (Guzzle\Http\Exception\BadResponseException $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url . ', method: ' . $method));
            return $e->getMessage();
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'Não foi possível fazer a requisição para: ' . $url . ', method: ' . $method));
            return $e->getMessage();
        }
    }

    /**
     * Importa um pedido da Skyhub para o Tucano
     *
     * @param  SkyhubPedido $order
     * @return boolean
     */
    public function importPedido($order) {
        try {
            $clienteFone = (sizeof($order['customer']['phones']) > 1)
                ? $order['customer']['phones'][1]
                : $order['customer']['phones'][0];

            $cliente        = Cliente::firstOrNew(['taxvat' => $order['customer']['vat_number']]);
            $cliente->tipo  = (strlen($order['customer']['vat_number']) > 11) ? 1 : 0;
            $cliente->nome  = $order['customer']['name'];
            $cliente->fone  = '(' . substr($clienteFone, 0, 2) . ')' . substr($clienteFone, 2, 5) . '-' . substr($clienteFone, 7);
            if ($cliente->save()) {
                Log::info("Cliente {$cliente->id} importado para o pedido " . $order['code']);
            } else {
                Log::warning('Não foi possível importar o cliente no pedido ' . $order['code']);
            }

            $clienteEndereco = Endereco::firstOrNew([
                'cliente_id' => $cliente->id,
                'cep'        => $order['shipping_address']['postcode']
            ]);
            $clienteEndereco->rua         = $order['shipping_address']['street'];
            $clienteEndereco->numero      = $order['shipping_address']['number'];
            $clienteEndereco->complemento = $order['shipping_address']['detail'];
            $clienteEndereco->bairro      = $order['shipping_address']['neighborhood'];
            $clienteEndereco->cidade      = $order['shipping_address']['city'];
            $clienteEndereco->uf          = $order['shipping_address']['region'];
            if ($clienteEndereco->save()) {
                Log::info("Endereço {$clienteEndereco->id} importado para o pedido " . $order['code']);
            } else {
                Log::warning('Não foi possível importar o endereço no pedido ' . $order['code']);
            }

            foreach ($order['items'] as $s_produto) {
                if ((int) $s_produto['product_id']) {
                    $produto = Produto::firstOrCreate(['sku' => $s_produto['product_id']]);

                    // Importa as informações do produto se não exisitir
                    if ($produto->wasRecentlyCreated) {
                        $produto->titulo = $s_produto['name'];
                        if ($produto->save()) {
                            Log::info('Produto ' . $s_produto['product_id'] . ' importado no pedido ' . $order['code']);
                        } else {
                            Log::warning('Não foi possível importar o produto no pedido ' . $order['code']);
                        }
                    }
                }
            }

            $marketplace = $this->parseMarketplaceName($order['code']);
            $operacao    = ($order['shipping_address']['region'] == \Config::get('tucano.uf'))
                ? \Config::get('tucano.notas.venda_interna')
                : \Config::get('tucano.notas.venda_externa');

            $codMarketplace = $this->parseMarketplaceId(
                $marketplace,
                substr($order['code'], strpos($order['code'], '-') + 1)
            );

            // Abre um transaction no banco de dados
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $pedido = Pedido::firstOrNew([
                'cliente_id'          => $cliente->id,
                'cliente_endereco_id' => $clienteEndereco->id,
                'codigo_marketplace'  => $codMarketplace
            ]);

            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->codigo_api          = isset($order['code']) ? $order['code'] : null;
            $pedido->frete_valor         = isset($order['shipping_cost']) ? $order['shipping_cost'] : null;
            $pedido->frete_metodo        = $this->parseShippingMethod(isset($order['shipping_method']) ? $order['shipping_method'] : null);
            $pedido->pagamento_metodo    = $this->parsePaymentMethod(isset($order['payments']) ? $order['payments'] : null);
            $pedido->codigo_marketplace  = $codMarketplace;
            $pedido->marketplace         = $marketplace;
            $pedido->operacao            = $operacao;
            $pedido->total               = $order['total_ordered'];
            $pedido->estimated_delivery  = substr($order['estimated_delivery'], 0, 10);
            $pedido->status              = $this->parseStatus(isset($order['status']['type']) ? $order['status']['type'] : null);
            $pedido->created_at          = substr($order['placed_at'], 0, 10) . ' ' . substr($order['placed_at'], 11, 8);
            if ($pedido->save()) {
                Log::info('Pedido importado ' . $order['code']);
            } else {
                Log::warning('Não foi possível importar o pedido ' . $order['code']);
            }

            foreach ($order['items'] as $s_produto) {
                if (!(int) $s_produto['product_id'])
                    continue;

                $pedidoProduto = PedidoProduto::firstOrNew([
                    'pedido_id'   => $pedido->id,
                    'produto_sku' => $s_produto['product_id'],
                    'valor'       => $s_produto['special_price'],
                    'quantidade'  => $s_produto['qty']
                ]);
                if ($pedidoProduto->save()) {
                    Log::info('PedidoProduto ' . $s_produto['product_id'] . ' importado no pedido ' . $order['code']);
                } else {
                    Log::warning('Não foi importar o PedidoProduto ' . $s_produto['product_id'] . ' / ' . $order['code']);
                }
            }

            // Fecha a transação e comita as alterações
            DB::commit();
            Log::debug('Transaction - commit');

            $this->request(
                sprintf('/orders/%s/exported', $order['code']),
                ['json' => [
                    "exported" => true
                ]],
                'PUT'
            );
            Log::notice("Pedido {$order['code']} marcado como exportado na skyhub");

            return true;
        } catch (\Exception $e) {
            // Fecha a trasação e cancela as alterações
            DB::rollBack();
            Log::debug('Transaction - rollback');

            Log::critical(logMessage($e, 'Pedido ' . $order['code'] . ' não importado'), $order);
            reportError('Pedido ' . $order['code'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());
            return false;
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

                Log::notice('Pedido ' . $s_pedido['code'] . ' removido da fila de espera da skyhub.');
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
        $s_pedido = $this->request("/orders/{$order}");

        if ($s_pedido) {
            $this->importPedido($s_pedido);
        }
    }

    /**
     * Cancela um pedido na Skyhub
     *
     * @param  Pedido $order pedido a ser cancelado
     * @return void
     */
    public function cancelOrder($order)
    {
        try {
            if (!$order->codigo_api) {
                throw new \Exception('Não foi possível cancelar o pedido: sem codigo_api válido', 1);
            }

            $this->request(
                sprintf('/orders/%s/cancel', $order->codigo_api),
                [],
                'POST'
            );
            Log::notice("Pedido {$order->id} / {$order->skyhub} cancelado na Skyhub.");
        } catch (Exception $e) {
            Log::warning(logMessage($e, "Não foi possível cancelar o pedido {$order->id} / {$order->skyhub} na Skyhub"));
        }
    }

    /**
     * Envia informações de faturamento e envio para skyhub
     *
     * @param  $order      Pedido order
     * @return boolean
     */
    public function orderInvoice($order)
    {
        try {
            foreach ($order->produtos as $produto) {
                $jsonItens[] = [
                    "sku" => $produto->produto->sku,
                    "qty" => $produto->quantidade
                ];
            }

            $jsonData = [
                "shipment" => [
                    "code"  => $order->rastreios->first()->rastreio,
                    "items" => $jsonItens,
                    "track" => [
                        "code"    => $order->rastreios->first()->rastreio,
                        "carrier" => "CORREIOS",
                        "method"  => $order->rastreios->first()->servico
                    ]
                ],
                "invoice" => [
                    "key" => $order->notas()->orderBy('created_at', 'DESC')->first()->chave
                ]
            ];

            $this->request(
                sprintf('/orders/%s/shipments', $order->codigo_api),
                ['json' => $jsonData],
                'POST'
            );

            Log::notice("Dados de envio e nota fiscal atualizados do pedido {$order->id} / {$order->codigo_api} na Skyhub", $jsonData);
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Pedido não faturado na Skyhub'), ['id' => $order->id, 'codigo_api' => $order->codigo_api]);
            reportError('Pedido não faturado na Skyhub: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $order->id);
        }
    }

    /**
     * Marca um pedido como entregue na Skyhub
     *
     * @param  Pedido $pedido
     * @return boolean
     */
    public function orderDelivered($pedido)
    {
        try {
            if ((int)$pedido->status === 3 && $pedido->codigo_api) {
                $this->request(
                    sprintf('/orders/%s/delivery', $pedido->codigo_api),
                    [],
                    'POST'
                );
                Log::notice("Pedido {$pedido->codigo_api} alterado para enviado na skyhub.");
            }
        } catch (\Exception $e) {
            Log::critical(logMessage($e, 'Não foi possível alterar o status do pedido na Skyhub'), ['id' => $pedido->id, 'codigo_api' => $pedido->codigo_api]);
            reportError('Não foi possível alterar o status do pedido na Skyhub: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $pedido->id);
        }
    }
}