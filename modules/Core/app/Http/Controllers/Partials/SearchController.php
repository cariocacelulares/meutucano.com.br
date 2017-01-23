<?php namespace Core\Http\Controllers\Partials;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
use Core\Models\Produto;
use Core\Models\Cliente;
use Rastreio\Models;
use Core\Transformers\ClientTransformer;
use Core\Transformers\OrderTransformer;
use Core\Transformers\ProductTransformer;

/**
 * Class SearchController
 * @package Core\Http\Controllers\Partials
 */
class SearchController extends Controller
{
    use RestResponseTrait;

    /**
     * Organiza as categorias passadas como string para array
     *
     * @param  string $categories
     * @return array
     */
    private function parseCategories($categories)
    {
        $return = [];
        $categories = explode(',', $categories);

        foreach ($categories as $category) {
            if ($category) {
                $return[] = $category;
            }
        }

        return $return;
    }

    /**
     * Busca comum de pedido, sem eloquence
     *
     * @param  string $term
     * @return Object
     */
    private function orders($term)
    {
        return Pedido
            ::with([
                'rastreios',
                'rastreios.pi',
                'rastreios.devolucao',
                'rastreios.logistica',
                'cliente',
                'notas'
            ])
            ->leftJoin('pedido_notas',        'pedidos.id',          '=', 'pedido_notas.pedido_id')
            ->leftJoin('pedido_rastreios',    'pedidos.id',          '=', 'pedido_rastreios.pedido_id')
            ->leftJoin('pedido_rastreio_pis', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->orWhere('pedidos.id',                    '=',    numbers($term))
            ->orWhere('pedidos.codigo_marketplace',    'LIKE', "%{$term}%")
            ->orWhere('pedidos.codigo_api',            'LIKE', "%{$term}%")
            ->orWhere('pedido_rastreios.rastreio',     'LIKE', "%{$term}%")
            ->orWhere('pedido_notas.chave',            'LIKE', "%{$term}%")
            ->orWhere('pedido_rastreio_pis.codigo_pi', 'LIKE', "%{$term}%")
            ->groupBy('pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC');
    }

    /**
     * Busca comum de cliente, sem eloquence
     *
     * @param  string $term
     * @return Object
     */
    private function customers($term)
    {
        return Cliente
            ::with(['enderecos' => function ($query) {
                $query->orderBy('created_at', 'DESC')->take(1);
            }])
            ->orWhere('taxvat',    'LIKE', "%{$term}%")
            ->orWhere('inscricao', 'LIKE', "%{$term}%")
            ->orWhere('nome',      'LIKE', "%{$term}%")
            ->orWhere('fone',      'LIKE', "%{$term}%")
            ->orWhere('email',     'LIKE', "%{$term}%")
            ->groupBy('id')
            ->orderBy('nome', 'ASC');
    }

    /**
     * Busca comum de produto, sem eloquence
     *
     * @param  string $term
     * @return Object
     */
    private function products($term)
    {
        return Produto
            ::where('sku',          'LIKE', "%{$term}%")
            ->orWhere('titulo',     'LIKE', "%{$term}%")
            ->orWhere('ncm',        'LIKE', "%{$term}%")
            ->orWhere('ean',        'LIKE', "%{$term}%")
            ->orWhere('referencia', 'LIKE', "%{$term}%")
            ->groupBy('sku')
            ->orderBy('titulo', 'ASC');
    }

    /**
     * Organiza os termos separando por espaço
     *
     * @param  string $term     termo pesquisado
     * @return array|string     termo organizado com wildcards
     */
    private function wildcard($term)
    {
        $return = [];
        $parts = explode(' ', $term);

        foreach ($parts as $key => $part) {
            if ($key === 0) {
                $return[] = "{$part}*";
            } elseif ($key === (count($parts) - 1)) {
                $return[] = "*{$part}";
            } else {
                $return[] = "*{$part}*";
            }
        }

        return $return;
    }

    /**
     * Busca pedidos, produtos e clientes no sistema
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function search()
    {
        $limit      = Input::get('limit')  ?: 9;
        $offset     = Input::get('offset') ?: 0;
        $term       = trim(Input::get('term'));
        // $termArray  = (strstr($term, ' ')) ? $this->wildcard($term) : $term;
        $busca      = [
            'pedidos'  => [],
            'clientes' => [],
            'produtos' => [],
            'offset'   => 0,
        ];

        try {
            $categories = $this->parseCategories(Input::get('categories'));

            if (!$categories || empty($categories)) {
                return $this->listResponse($busca);
            }

            if (in_array('pedidos', $categories)) {
                $busca['pedidos'] = $this->orders($term)
                    ->offset($offset)
                    ->limit($limit)
                    ->get([
                        'pedidos.*'
                    ]);

                $busca['pedidos'] = OrderTransformer::search($busca['pedidos']);
            }

            if (in_array('clientes', $categories)) {
                /*$busca['clientes'] = Cliente
                    ::with('enderecos')
                    ->search($termArray, [
                        'nome'      => 100,
                        'taxvat'    => 75,
                        'email'     => 50,
                        'inscricao' => 25,
                    ])*/
                $busca['clientes'] = $this->customers($term)
                    ->with('enderecos')
                    ->groupBy('id')
                    ->orderBy('nome', 'ASC')
                    ->offset($offset)
                    ->limit($limit)
                    ->get();

                $busca['clientes'] = ClientTransformer::search($busca['clientes']);
            }

            if (in_array('produtos', $categories)) {
                /*$busca['produtos'] = Produto
                    ::search($termArray, [
                        'sku'        => 125,
                        'titulo'     => 100,
                        'ncm'        => 75,
                        'ean'        => 50,
                        'referencia' => 25,
                    ])*/
                $busca['produtos'] = $this->products($term)
                    ->groupBy('sku')
                    ->orderBy('titulo', 'ASC')
                    ->offset($offset)
                    ->limit($limit)
                    ->get();

                $busca['produtos'] = ProductTransformer::search($busca['produtos']);
            }

            $busca['offset'] = $offset;
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Ocorreu um erro ao tentar realizar um busca.'));
        }

        return $this->listResponse($busca);
    }
}
