<?php namespace Core\Http\Controllers\Partials;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\Pedido;
use Core\Models\Produto\Produto;
use Core\Models\Cliente\Cliente;
use Rastreio\Models;

/**
 * Class SearchController
 * @package Core\Http\Controllers\Partials
 */
class SearchController extends Controller
{
    use RestResponseTrait;

    /**
     * Busca pedidos no sistema
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function search()
    {
        $term = Input::get('term');
        $busca = [];

        $busca['pedidos'] = Pedido
            ::with([
                'rastreios',
                'rastreios.pi',
                'rastreios.devolucao',
                'rastreios.logistica',
                'cliente',
                'notas'
            ])
            ->leftJoin('pedido_notas', 'pedidos.id', '=', 'pedido_notas.pedido_id')
            ->leftJoin('pedido_rastreios', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->leftJoin('pedido_rastreio_pis', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->orWhere('pedidos.id', '=', numbers($term))
            ->orWhere('pedidos.codigo_marketplace', 'LIKE', '%' . $term . '%')
            ->orWhere('pedidos.codigo_api', 'LIKE', '%' . $term . '%')
            ->orWhere('pedido_rastreios.rastreio', 'LIKE', '%' . $term . '%')
            ->orWhere('pedido_notas.chave', 'LIKE', '%' . $term . '%')
            ->orWhere('pedido_rastreio_pis.codigo_pi', 'LIKE', '%' . $term . '%')
            ->groupBy('pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC')
            ->get([
                'pedidos.*'
            ]);

        $busca['produtos'] = Produto
            ::where('sku', 'LIKE', '%' . $term . '%')
            ->orWhere('titulo', 'LIKE', '%' . $term . '%')
            ->orWhere('ncm', 'LIKE', '%' . $term . '%')
            ->orWhere('ean', 'LIKE', '%' . $term . '%')
            ->orWhere('referencia', 'LIKE', '%' . $term . '%')
            ->groupBy('sku')
            ->orderBy('titulo', 'ASC')
            ->get();

        $busca['clientes'] = Cliente
            ::with(['enderecos' => function($query)
                {
                    $query->orderBy('created_at', 'DESC')->take(1);
                }])
            ->orWhere('taxvat', 'LIKE', '%' . $term . '%')
            ->orWhere('inscricao', 'LIKE', '%' . $term . '%')
            ->orWhere('nome', 'LIKE', '%' . $term . '%')
            ->orWhere('fone', 'LIKE', '%' . $term . '%')
            ->orWhere('email', 'LIKE', '%' . $term . '%')
            ->groupBy('id')
            ->orderBy('nome', 'ASC')
            ->get();

        return $this->listResponse($busca);
    }
}