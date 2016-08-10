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
