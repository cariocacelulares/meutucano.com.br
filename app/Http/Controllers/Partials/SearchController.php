<?php namespace App\Http\Controllers\Partials;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Pedido;
use App\Models\Produto\Produto;
use App\Models\Cliente\Cliente;
use App\Models\Pedido\Rastreio;
use Illuminate\Support\Facades\Input;

/**
 * Class SearchController
 * @package App\Http\Controllers\Partials
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
                'nota'
            ])
            ->leftJoin('pedido_notas', 'pedidos.id', '=', 'pedido_notas.pedido_id')
            ->leftJoin('pedido_rastreios', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->orWhere('pedidos.id', '=', numbers($term))
            ->orWhere('pedidos.codigo_marketplace', 'LIKE', '%' . $term . '%')
            ->orWhere('pedidos.codigo_api', 'LIKE', '%' . $term . '%')
            ->orWhere('pedido_rastreios.rastreio', 'LIKE', '%' . $term . '%')
            ->orWhere('pedido_notas.chave', 'LIKE', '%' . $term . '%')
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