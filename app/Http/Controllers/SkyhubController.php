<?php namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoProduto;
use App\Models\Produto\Produto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

/**
 * Class SkyhubController
 * @package App\Http\Controllers
 */
class SkyhubController extends Controller
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

            $codMarketplace = $this->parseMarketplaceId(
                $marketplace,
                substr($s_pedido['code'], strpos($s_pedido['code'], '-') + 1)
            );

            $pedido = Pedido::firstOrCreate([
                'cliente_id'          => $cliente->id,
                'cliente_endereco_id' => $clienteEndereco->id,
                'codigo_marketplace'  => $codMarketplace
            ]);
            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->codigo_skyhub       = $s_pedido['code'];
            $pedido->frete_skyhub        = $s_pedido['shipping_cost'];
            $pedido->codigo_marketplace  = $codMarketplace;
            $pedido->marketplace         = $marketplace;
            $pedido->operacao            = $operacao;
            $pedido->total               = $s_pedido['total_ordered'];
            $pedido->estimated_delivery  = substr($s_pedido['estimated_delivery'], 0, 10);
            $pedido->status              = $this->parseMarketplaceStatus($s_pedido['status']['type']);
            $pedido->created_at          = substr($s_pedido['placed_at'], 0, 10) . ' ' . substr($s_pedido['placed_at'], 11, 8);

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

            return sprintf('Pedido %s importado', $s_pedido['code']);
        } catch (\Exception $e) {
            $error = 'Pedido ' . $s_pedido['code'] . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $s_pedido;

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
        $pedidos = Pedido::whereNotNull('codigo_skyhub')->get();
        foreach ($pedidos as $pedido) {
            $s_pedido           = $this->request('/orders/' . $pedido['codigo_skyhub']);

            $pedido->status     = $this->parseMarketplaceStatus($s_pedido['status']['type']);
            $pedido->created_at = substr($s_pedido['placed_at'], 0, 10) . ' ' . substr($s_pedido['placed_at'], 11, 8);

            if ($pedido->rastreio) {
                if ($pedido->rastreio->status == 4) {
                    $pedido->status = 3;
                }
            }

            $pedido->save();

            if ($pedido->rastreio) {
                if ($pedido->rastreio->status == 4) {
                    $this->refreshStatus($pedido);
                }
            }
        }
    }

    /**
     * Update stock data from Magento
     *
     * @param  SkyhubPedido $s_pedido
     * @return boolean
     */
    protected function updateStockData($s_pedido)
    {
        try {
            $dataPedido = Carbon::createFromFormat('Y-m-d', substr($s_pedido['placed_at'], 0, 10))->format('Ymd');

            //TODO: Remover essa linha de código
            if ($dataPedido <= 20160818)
                return false;
            //-----

            $newStatus = $this->parseMarketplaceStatus($s_pedido['status']['type']);

            foreach ($s_pedido['items'] as $s_produto) {
                $stockChange[$s_produto['product_id']] = $s_produto['qty'];
            }

            if ($pedido = Pedido::where('codigo_skyhub', '=', $s_pedido['code'])->first()) {
                if (($newStatus != $pedido->status) && $newStatus == 5) {
                    with(new MagentoController())->updateInventory($stockChange);
                }
            } elseif ($newStatus != 5) {
                with(new MagentoController())->updateInventory($stockChange, false);
            }

            return true;
        } catch (\Exception $e) {
            $error = 'Não foi possível alterar estoque no Magento: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $s_pedido;

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
                $this->updateStockData($s_pedido);

                $this->request(
                    sprintf('/queues/orders/%s', $s_pedido['code']),
                    [],
                    'DELETE'
                );
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
                        sprintf('/orders/%s/shipments', $pedido->codigo_skyhub),
                        ['json' => $jsonData],
                        'POST'
                    );
                }

                return true;

            } catch (\Exception $e) {
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
                            sprintf('/orders/%s/delivery', $pedido->codigo_skyhub),
                            [],
                            'POST'
                        );
                        break;
                    }
                    case 5: {
                        $this->request(
                            sprintf('/orders/%s/cancel', $pedido->codigo_skyhub),
                            [],
                            'POST'
                        );
                        break;
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
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
            \Log::error('Não foi possível cancelar o pedido na Skyhub' . $e->getMessage() . ' - ' . $e->getLine());
            return false;
        }
    }
}
