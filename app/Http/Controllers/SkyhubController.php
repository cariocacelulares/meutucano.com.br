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

        return $idPedido;
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
            $request_parameters = http_build_query($params);

            $request_opts = array(
                'http' => [
                    'method'  => $method,
                    'header'  => "Accept: application/json \r\n" .
                                "Content-type: application/x-www-form-urlencoded \r\n" .
                                "X-User-Email: " . \Config::get('tucano.skyhub.api.email') . " \r\n" .
                                "X-User-Token: " . \Config::get('tucano.skyhub.api.token') . " \r\n",
                    'content' => $request_parameters
                ]
            );
            
            $context  = stream_context_create($request_opts);

            $result = file_get_contents(sprintf('%s%s',
                \Config::get('tucano.skyhub.api.url'),
                $url
            ), false, $context);


            return json_decode($result, true);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * GET approved orders from SkyHub
     * 
     * @return void 
     */
    public function getPedidos()
    {
        $pedidos = $this->request('/orders', [
            'per_page' => 100, 
            'filters[sync_status][]' => 'NOT_SYNCED'
        ]);

        if ($pedidos['orders']) {
            $countImportado = 0;
            foreach ($pedidos['orders'] as $s_pedido) {
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

                    $countImportado++;
                } catch (\Exception $e) {
                    \Log::error('Pedido ' . $s_pedido['code'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());
                }
            }
        }

        return $countImportado . ' pedidos importado(s) de ' . $pedidos['total'];
    }
}
