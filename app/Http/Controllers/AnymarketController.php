<?php namespace App\Http\Controllers;

use App\Models\AnymarketFeed;
use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoProduto;
use App\Models\Produto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

/**
 * Class AnymarketController
 * @package App\Http\Controllers
 */
class AnymarketController extends Controller
{

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
            $request_opts = array(
                'http' => [
                    'method' => "GET",
                    'header' => "Content-Type: application/json \r\n" .
                                "gumgaToken: " . \Config::get('tucano.anymarket.api.token') . " \r\n"
                ]
            );

            $request_parameters = http_build_query($params);
            $context  = stream_context_create($request_opts);

            $result = file_get_contents(sprintf('%s%s%s',
                \Config::get('tucano.anymarket.api.url'),
                $url,
                (sizeof($params)) ? '?' . $request_parameters : ''
            ), false, $context);

            return json_decode($result, true);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Parse ID of marketplace
     *
     * @param  array  $an_pedido
     * @return string
     */
    public function parseMarketplaceId($an_pedido = null)
    {
        if ($an_pedido['marketPlace'] === 'B2W') {
            if (substr($an_pedido['marketPlaceId'], 0, 1) !== '0') {
                $inicio = substr($an_pedido['marketPlaceId'], 0, 2);

                if ($inicio === '10') {
                    $inicioId = '01';
                    $posSub   = 2;
                } else {
                    $inicioId = '0' . substr($an_pedido['marketPlaceId'], 0, 1);
                    $posSub   = 1;
                }

                $fim = substr($an_pedido['marketPlaceId'], $posSub, -2);

                return $inicioId . '-' . $fim;
            }
        } elseif ($an_pedido['marketPlace'] === 'WALMART') {
            return substr($an_pedido['marketPlaceId'], 0, strpos($an_pedido['marketPlaceId'], '-'));
        }

        return $an_pedido['marketPlaceId'];
    }

    /**
     * Parse state and return UF
     *
     * @param  string $state
     * @return string
     */
    private function parseUf($state = null)
    {
        if (strlen($state) > 2) {
            return array_search($state, Config::get('tucano.estados_uf'));
        }

        return $state;
    }

    /**
     * Parse marketplace name
     *
     * @param  string $marketplace
     * @return string
     */
    private function parseMarketplace($marketplace = null)
    {
        switch ($marketplace) {
            case 'MERCADO_LIVRE':
                return 'MERCADOLIVRE';
            case 'ECOMMERCE':
                return 'Site';
            default:
                return $marketplace;
        }
    }

    /**
     * Parse date in UTC or UTC-3 format
     *
     * @param  string  $date
     * @param  boolean $toUtc
     * @return string
     */
    private function parseDate($date = null, $toUtc = false)
    {
        if ($toUtc === true) {
            return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('Y-m-d\TH:i:s');
        }

        return Carbon::createFromFormat('Y-m-d\TH:i:sZ', $date, 'UTC')->setTimezone('America/Sao_Paulo')->format('Y-m-d H:i:s');
    }

    /**
     * Parse fone
     *
     * @param  string  $fone
     * @param  boolean $toClean
     * @return string
     */
    private function parseFone($fone = null, $toClean = false)
    {
        $fone = str_replace(' ', '', $fone);

        if ($toClean === true) {
            return str_replace(['-', '(', ')', ' '], [''], $fone);
        }

        return ('('. substr($fone, 0, 2) .') ' . substr($fone, 2, -4) . '-' . substr($fone, -4));
    }

    /**
     * Parse e-mail
     *
     * @param  string $email
     * @return string|null
     */
    private function parseEmail($email)
    {
        if (strpos($email, 'b2w.com') === false && strpos($email, 'extra.com.br') === false && strpos($email, 'mercadolivre.com') === false) {
            return $email;
        }

        return null;
    }

    /**
     * Get new orders from AnyMarket
     *
     * @return void
     */
    public function feedSale() // Primeiro pedido 31/05/2015 17:08
    {
        $last = AnymarketFeed::where('tipo', '=', '0')->orderBy('created_at', 'DESC')->first();
        $lastDate = $this->parseDate($last->created_at, true);

        $pedidos = $this->request('/orders', ['limit' => 100, 'createdAfter' => $lastDate]);

        if (array_key_exists('content', $pedidos)) {
            AnymarketFeed::create(['tipo' => '0']);
        } else {
            return 'Nenhum pedido para importar';
        }

        $count = 0;
        foreach ($pedidos['content'] as $an_pedido) {
            $pedido = null;

            if ($an_pedido['status'] === 'CANCELED') // Não importar pedidos cancelados
                continue;

            if (array_key_exists('invoice', $an_pedido)) { // Pedido já existe e está faturado
                $idPedido = ((int) $an_pedido['invoice']['number']) . ((int) $an_pedido['invoice']['series']);

                $pedido = Pedido::withTrashed()->find($idPedido);
            }

            if ($pedido === null) { // Pedido não existe ou não está faturado
                $idPedido = 100000000 + (int) $an_pedido['id'];

                $pedido = Pedido::withTrashed()->firstOrNew(['id' => $idPedido]);
            }

            $an_pedido['shipping']['state'] = $this->parseUf($an_pedido['shipping']['state']);

            // Atualiza informações do pedido
            $pedido->codigo_anymarket   = $an_pedido['id'];
            $pedido->frete_anymarket    = $an_pedido['freight'];
            $pedido->codigo_marketplace = $this->parseMarketplaceId($an_pedido);
            $pedido->marketplace        = $this->parseMarketplace($an_pedido['marketPlace']);
            $pedido->operacao           = ($an_pedido['shipping']['state'] == Config::get('tucano.uf')) ? Config::get('tucano.venda_interna') : Config::get('tucano.venda_externa');
            $pedido->total              = $an_pedido['total'];

            $pedido->created_at         = $this->parseDate($an_pedido['createdAt']);

            // Dados do cliente
            $cliente = Cliente::firstOrNew(['taxvat' => $an_pedido['buyer']['document']]);

            $cliente->nome   = mb_strtoupper($an_pedido['buyer']['name']);
            $cliente->taxvat = $an_pedido['buyer']['document'];
            $cliente->tipo   = ($an_pedido['buyer']['documentType'] === 'CPF') ? 0 : 1;
            $cliente->fone   = $this->parseFone($an_pedido['buyer']['phone']);
            $cliente->email  = $this->parseEmail($an_pedido['buyer']['email']);

            $cliente->save();
            $pedido->cliente_id = $cliente->id;

            // Dados de endereço
            $cepFormatted = str_replace('-', '', $an_pedido['shipping']['zipCode']);
            $clienteEndereco = ClienteEndereco::firstOrNew(['cliente_id' => $cliente->id, 'cep' => $cepFormatted]);

            if (substr_count($an_pedido['shipping']['address'], "\n") > 1) {
                $endereco = explode("\n", $an_pedido['shipping']['address']);

                $clienteEndereco->rua         = mb_strtoupper($endereco[0]);
                $clienteEndereco->numero      = mb_strtoupper($endereco[1]);
                $clienteEndereco->complemento = mb_strtoupper($endereco[2]);
                $clienteEndereco->bairro      = mb_strtoupper($endereco[3]);
            } else {
                // Rua
                if (array_key_exists('street', $an_pedido['shipping'])) {
                    $clienteEndereco->rua = mb_strtoupper($an_pedido['shipping']['street']);
                } else {
                    $clienteEndereco->rua = mb_strtoupper((($pos = strpos($an_pedido['shipping']['address'], 'nº')) !== false)
                        ? substr($an_pedido['shipping']['address'], 0, $pos)
                        : substr($an_pedido['shipping']['address'], 0, strpos($an_pedido['shipping']['address'], '-')));
                }

                // Número
                if (array_key_exists('number', $an_pedido['shipping'])) {
                    $clienteEndereco->numero = mb_strtoupper($an_pedido['shipping']['number']);
                } else {
                    $clienteEndereco->numero = mb_strtoupper((($pos = strpos($an_pedido['shipping']['address'], 'nº')) !== false)
                        ? substr($an_pedido['shipping']['address'], $pos + 3, strpos($an_pedido['shipping']['address'], '-') - $pos - 3)
                        : 0);
                }

                // Complemento
                if (array_key_exists('comment', $an_pedido['shipping'])) {
                    $clienteEndereco->complemento = mb_strtoupper($an_pedido['shipping']['comment']);
                } else {
                    if (substr_count($an_pedido['shipping']['address'], '-') > 2) {
                        $posInicial = strpos($an_pedido['shipping']['address'], '-') + 2;
                        $posFinal   = strpos($an_pedido['shipping']['address'], '-', $posInicial);

                        $clienteEndereco->complemento = mb_strtoupper(substr($an_pedido['shipping']['address'], $posInicial, $posFinal - $posInicial));
                    } elseif (substr_count($an_pedido['shipping']['address'], '-') > 1) {
                        $posInicial = strrpos($an_pedido['shipping']['address'], '-') + 2;
                        $posFinal   = strlen($an_pedido['shipping']['address']);

                        $clienteEndereco->complemento = mb_strtoupper(substr($an_pedido['shipping']['address'], $posInicial, $posFinal - $posInicial));
                    } else {
                        $clienteEndereco->complemento = null;
                    }
                }

                // Bairro
                if (array_key_exists('neighborhood', $an_pedido['shipping'])) {
                    $clienteEndereco->bairro = mb_strtoupper($an_pedido['shipping']['neighborhood']);
                } else {
                    if (substr_count($an_pedido['shipping']['address'], '-') > 2) {
                        $posInicial = strpos($an_pedido['shipping']['address'], '-', strpos($an_pedido['shipping']['address'], '-') + 2) + 2;
                        $posFinal   = strpos($an_pedido['shipping']['address'], '-', $posInicial);

                        $clienteEndereco->bairro = mb_strtoupper(substr($an_pedido['shipping']['address'], $posInicial, $posFinal - $posInicial));
                    } elseif (substr_count($an_pedido['shipping']['address'], '-') > 1) {
                        $posInicial = strpos($an_pedido['shipping']['address'], '-') + 2;
                        $posFinal   = strpos($an_pedido['shipping']['address'], '-', $posInicial);

                        $clienteEndereco->bairro = mb_strtoupper(substr($an_pedido['shipping']['address'], $posInicial, $posFinal - $posInicial));
                    } else {
                        $clienteEndereco->bairro = null;
                    }
                }
            }

            $clienteEndereco->cidade = mb_strtoupper($an_pedido['shipping']['city']);
            $clienteEndereco->uf     = mb_strtoupper($an_pedido['shipping']['state']);

            $clienteEndereco->save();
            $pedido->cliente_endereco_id = $clienteEndereco->id;

            $pedido->save();

            // Produtos do pedido
            if ($an_pedido['items']) {
                foreach ($an_pedido['items'] as $an_produto) {
                    $produto = Produto::firstOrNew(['sku' => $an_produto['sku']['partnerId']]);

                    if (!$produto->exists) {
                        $produto->titulo = mb_strtoupper($an_produto['sku']['title']);
                        $produto->save();
                    }

                    $pedidoProduto = PedidoProduto::firstOrNew(['pedido_id' => $idPedido, 'produto_sku' => $produto->sku]);

                    $pedidoProduto->valor      = $an_produto['unit'];
                    $pedidoProduto->quantidade = $an_produto['amount'];
                    $pedidoProduto->save();
                }
            }

            $count++;
        }

        return $count . ' pedidos importado(s)';
    }
}
