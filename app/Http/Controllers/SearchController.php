<?php namespace App\Http\Controllers;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\PedidoNota;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use App\Models\PedidoProduto;
use App\Models\PedidoImposto;
use App\Models\Produto;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

/**
 * Class SearchController
 * @package App\Http\Controllers
 */
class SearchController extends Controller
{
    use RestResponseTrait;

    public function difa()
    {
        $notas = PedidoNota::with(['pedido', 'pedido.imposto', 'pedido.endereco'])
            ->where(\DB::raw('YEAR(pedido_notas.data)'), '=', date('Y'))
            ->get();

        $difaEstado = [
            'AC' => 4,
            'AL' => 4,
            'AP' => 4.4,
            'AM' => 4.4,
            'BA' => 4.4,
            'CE' => 4,
            'DF' => 4.4,
            'ES' => 4,
            'GO' => 4,
            'MA' => 4.4,
            'MT' => 4,
            'MS' => 4,
            'MG' => 2.4,
            'PR' => 4,
            'PB' => 4.4,
            'PA' => 2.4,
            'PE' => 4.4,
            'PI' => 4,
            'RJ' => 2.4,
            'RN' => 4.4,
            'RS' => 2.4,
            'RO' => 4.2,
            'RR' => 4,
            'SP' => 2.4,
            'SE' => 4.4,
            'TO' => 4.4 
        ];

        foreach ($notas as $nota) {
            // 172, 173
            if ($imposto = $nota->pedido->imposto) {

                $skus = [];
                if ($produtos = $nota->pedido->produtos) {
                    $skus = array_pluck($produtos->toArray(), 'produto_sku');
                }

                $estadoCliente = $nota->pedido->endereco->uf;

                if ($estadoCliente == 'SC')
                    continue;

                $difaCalculo = ($difaEstado[$estadoCliente] / 100);

                if (in_array(172, $skus) || in_array(173, $skus)) {
                    $baseCalculo = $nota->pedido->total * 0.2;
                } else {
                    $baseCalculo = $nota->pedido->total;
                }

                $difa = $difaCalculo * $baseCalculo;
                $difa = round($difa, 2);

                $nota->pedido->imposto->icms_destinatario = $difa;
                $nota->pedido->imposto->save();
            }

            break;
        }
    }

    /**
     * Busca de pedidos
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function search()
    {
        $query = Input::get('search');

        /**
         * Pedidos
         */
        $busca = Pedido::with([
            'nota',
            'cliente',
            'rastreios', 'rastreios.rastreioRef',
            'rastreios.pedido', 'rastreios.pedido.cliente', 'rastreios.pedido.endereco',
            'rastreios.pi', 'rastreios.pi.rastreioRef',
            'rastreios.devolucao', 'rastreios.devolucao.rastreioRef',
            'rastreios.logistica', 'rastreios.logistica.rastreioRef',
        ])
            ->leftJoin('pedido_notas', 'pedidos.id', '=', 'pedido_notas.pedido_id')
            ->join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
            ->join('cliente_enderecos', 'pedidos.cliente_endereco_id', '=', 'cliente_enderecos.id')
            ->leftJoin('pedido_rastreios', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->leftJoin('pedido_rastreio_pis', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->leftJoin('pedido_rastreio_logisticas', 'pedido_rastreios.id', '=', 'pedido_rastreio_logisticas.rastreio_id')
            ->leftJoin('pedido_produtos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')

            ->orWhere('pedidos.id', 'LIKE', '%' . $query . '%')
            ->orWhere('pedidos.codigo_marketplace', 'LIKE', '%' . $query . '%')
            ->orWhere('clientes.nome', 'LIKE', '%' . $query . '%')
            ->orWhere('cliente_enderecos.cep', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreios.rastreio', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreio_pis.codigo_pi', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreio_logisticas.autorizacao', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_produtos.imei', 'LIKE', '%' . $query . '%')

            ->groupBy('pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC')

            ->get([
                'pedidos.*'
            ]);

        return $this->listResponse($busca);
    }
}
