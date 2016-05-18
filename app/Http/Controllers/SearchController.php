<?php namespace App\Http\Controllers;

use App\Http\Controllers\RestResponseTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\PedidoNota;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use App\Models\Produto;
use Illuminate\Support\Facades\Input;

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
        $busca['pedidos'] = Pedido::with(['cliente', 'nota'])
            ->autoJoin('inner', PedidoNota::class, 'nota')
            ->autoJoin('inner', Cliente::class, 'cliente', 'cliente_id', 'id')
            ->where('pedidos.id', 'LIKE', '%' . $query . '%')
            ->orWhere('pedidos.codigo_marketplace', 'LIKE', '%' . $query . '%')
            ->orWhere('cliente.nome', 'LIKE', '%' . $query . '%')
            ->take(6)
            ->get([
                'pedidos.*'
            ]);

        /**
         * Rastreios
         */
        $busca['rastreios'] = PedidoRastreio::with(['pi', 'pi.rastreio', 'pi.rastreioRef'])
            ->autoJoin('left', PedidoRastreioPi::class, 'pi')
            ->autoJoin('inner', Pedido::class, 'pedido', 'pedido_id')
            ->where('pedido_rastreios.rastreio', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido_rastreios.pedido_id', 'LIKE', '%' . $query . '%')
            ->orWhere('pedido.codigo_marketplace', 'LIKE', '%' . $query . '%')
            ->orWhere('pi.codigo_pi', 'LIKE', '%' . $query . '%')
            ->orWhere('pi.protocolo', 'LIKE', '%' . $query . '%')
            ->take(3)
            ->get([
                'pedido_rastreios.*'
            ]);

        return $this->listResponse($busca);
    }
}