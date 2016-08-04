<?php namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoProduto;
use App\Models\Produto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

/**
 * Class SkyhubController
 * @package App\Http\Controllers
 */
class SkyhubController extends Controller
{

    /**
     * Parse ID of marketplace
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
     * Parse name of marketplace
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
     * Creates an HTTP request to Anymarket API
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
            $client = new \GuzzleHttp\Client([
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
            return $e->getMessage();
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

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

            $clienteEndereco = ClienteEndereco::firstOrNew([
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

            $marketplace = $this->parseMarketplaceName($s_pedido['code']);
            $operacao    = ($s_pedido['shipping_address']['region'] == \Config::get('tucano.uf')) 
                ? \Config::get('tucano.venda_interna')
                : \Config::get('tucano.venda_externa');

            $pedido = Pedido::firstOrCreate([
                'cliente_id'          => $cliente->id, 
                'cliente_endereco_id' => $clienteEndereco->id, 
                'codigo_skyhub'       => $s_pedido['code']
            ]);
            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->codigo_skyhub       = $s_pedido['code'];
            $pedido->frete_skyhub        = $s_pedido['shipping_cost'];
            $pedido->codigo_marketplace  = $this->parseMarketplaceId(
                $marketplace, 
                substr($s_pedido['code'], strpos($s_pedido['code'], '-') + 1)
            );
            $pedido->marketplace         = $marketplace;
            $pedido->operacao            = $operacao;
            $pedido->total               = $s_pedido['total_ordered'];
            $pedido->estimated_delivery  = substr($s_pedido['estimated_delivery'], 0, 10);

            $pedido->save();

            foreach ($s_pedido['items'] as $s_produto) {
                $produto = Produto::firstOrCreate(['sku' => $s_produto['product_id']]);
                $produto->titulo = $s_produto['name'];
                $produto->save();

                $pedidoProduto = PedidoProduto::firstOrCreate([
                    'pedido_id'   => $pedido->id,
                    'produto_sku' => $produto->sku,
                    'valor'       => $s_produto['special_price'],
                    'quantidade'  => $s_produto['qty']
                ]);
                $pedidoProduto->save();
            }

            $this->request(
                sprintf('/orders/%s/exported', $s_pedido['code']), 
                ['json' => [
                    "exported" => true
                ]],
                'PUT'
            );

            $countImportado++;

            return sprintf('Pedido %s importado', $s_pedido['code']);
        } catch (\Exception $e) {
            \Log::error('Pedido ' . $s_pedido['code'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());
            return false;
        }
    }

    /**
     * GET orders from SkyHub
     * 
     * @return void 
     */
    public function getPedidos()
    {
        $pedidos = $this->request('/orders?per_page=100&filters[sync_status][]=NOT_SYNCED');

        if ($pedidos) {
            foreach ($pedidos['orders'] as $s_pedido) {
                print_r($s_pedido);
                // $this->importPedido($s_pedido);
            }  
        }
    }

    /**
     * GET queue orders from SkyHub
     * 
     * @return void 
     */
    public function queue()
    {
        $s_pedido = $this->request('/queues/orders');

        if ($s_pedido) {
            $this->importPedido($s_pedido);

            $this->request(
                sprintf('/queues/orders/%s', $s_pedido['code']), 
                [],
                'DELETE'
            );
        }
    }

    /**
     * Add information about order invoice in Skyhub
     * @param  $id      Order id
     * @return boolean 
     */
    public function orderInvoice($id) 
    {
        if ($pedido = Pedido::find($id)) {

            try {
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
                    sprintf('/orders/%s/shipments', $pedido->codigo_skyhub), 
                    ['json' => $jsonData],
                    'POST'
                );

            } catch (\Exception $e) {
                \Log::error('Pedido ' . $id . ' não faturado: ' . $e->getMessage() . ' - ' . $e->getLine());
            }
        }
    }
}
