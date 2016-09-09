<?php namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoProduto;
use App\Models\Produto\Produto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Artisaninweb\SoapWrapper\Facades\SoapWrapper;

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
        $this->api     = new \SoapClient(\Config::get('tucano.magento.api.host'));
        $this->session = $this->api->login(
            \Config::get('tucano.magento.api.user'),
            \Config::get('tucano.magento.api.key')
        );
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
            'pending_payment' => 0,
            'processing'      => 1,
            'complete'        => 2,
            'canceled'        => 5
        ];

        return (!$reverse) ? $statusConvert[$status] : array_search($status, $statusConvert);
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
            return $e->getMessage();
        } catch (\Exception $e) {
            return $e->getMessage();
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
            $cliente->fone  = ($mg_order['shipping_address']['fax']) ?: $mg_order['shipping_address']['telephone'];
            $cliente->email = $mg_order['customer_email'];
            $cliente->save();

            $clienteEndereco = ClienteEndereco::firstOrNew([
                'cliente_id' => $cliente->id,
                'cep'        => $mg_order['shipping_address']['postcode']
            ]);

            $endereco = explode("\n", $mg_order['shipping_address']['street']);
            $uf       = array_search($mg_order['shipping_address']['region'], \Config::get('tucano.estados_uf'));

            $clienteEndereco->rua         = $endereco[0];
            $clienteEndereco->numero      = $endereco[1];
            $clienteEndereco->bairro      = $endereco[2];
            $clienteEndereco->complemento = $endereco[3];
            $clienteEndereco->cidade      = $mg_order['shipping_address']['city'];
            $clienteEndereco->uf          = $uf;
            $clienteEndereco->save();

            $operacao    = ($uf == \Config::get('tucano.uf'))
                ? \Config::get('tucano.venda_interna')
                : \Config::get('tucano.venda_externa');

            $pedido = Pedido::firstOrCreate([
                'cliente_id'          => $cliente->id,
                'cliente_endereco_id' => $clienteEndereco->id,
                'codigo_marketplace'  => $mg_order['increment_id']
            ]);
            $pedido->cliente_id          = $cliente->id;
            $pedido->cliente_endereco_id = $clienteEndereco->id;
            $pedido->frete_skyhub        = $mg_order['shipping_amount'];
            $pedido->codigo_marketplace  = $mg_order['increment_id'];
            $pedido->marketplace         = 'Site';
            $pedido->operacao            = $operacao;
            $pedido->total               = $mg_order['subtotal'];
            // $pedido->estimated_delivery  = substr($s_pedido['estimated_delivery'], 0, 10);
            $pedido->status              = $this->parseMagentoStatus($mg_order['state']);
            $pedido->created_at          = $mg_order['created_at'];

            $pedido->save();

            // foreach ($s_pedido['items'] as $s_produto) {
            //     $produto = Produto::firstOrCreate(['sku' => $s_produto['product_id']]);
            //     $produto->titulo = $s_produto['name'];
            //     $produto->save();

            //     $pedidoProduto = PedidoProduto::firstOrCreate([
            //         'pedido_id'   => $pedido->id,
            //         'produto_sku' => $produto->sku,
            //         'valor'       => $s_produto['special_price'],
            //         'quantidade'  => $s_produto['qty']
            //     ]);
            //     $pedidoProduto->save();
            // }

            // $this->request(
            //     sprintf('/orders/%s/exported', $s_pedido['code']),
            //     ['json' => [
            //         "exported" => true
            //     ]],
            //     'PUT'
            // );

            // return sprintf('Pedido %s importado', $s_pedido['code']);
        } catch (\Exception $e) {
            throw $e;

            // Mail::send('emails.error', [
            //     'error' => $error
            // ], function ($m) {
            //     $m->from('dev@cariocacelulares.com.br', 'Meu Tucano');
            //     $m->to('dev.cariocacelulares@gmail.com', 'DEV')->subject('Erro no sistema!');
            // });
            return false;
        }
    }

    /**
     * Proccess order queue
     * @return [type] [description]
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
            //         // $this->updateStockData($s_pedido);
            //         // $order = $this->request(sprintf('orders/%s', $order['order_id']), [], 'DELETE');
                }
            }
        }
    }
}
