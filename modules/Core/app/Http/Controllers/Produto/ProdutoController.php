<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use InspecaoTecnica\Models\InspecaoTecnica;
use Core\Models\Produto;
use Core\Models\Pedido\PedidoProduto;
use Core\Http\Requests\ProdutoRequest as Request;
use Core\Transformers\ProductTransformer;

/**
 * Class ProdutoController
 * @package Core\Http\Controllers\Produto
 */
class ProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Produto::class;

    /**
     * Lista produtos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)
            // ::with('linha')
            // ->with('marca')
            ::where('produtos.ativo', true)
            ->orderBy('produtos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        $ids = [];
        foreach ($list as $item) {
            $ids[] = $item->sku;
        }

        $reservados = PedidoProduto
            ::select('pedido_produtos.produto_sku', 'pedidos.status', DB::raw('COUNT(*) as count'))
            ->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->with(['pedido'])
            ->whereIn('pedido_produtos.produto_sku', $ids)
            ->whereIn('pedidos.status', [0,1])
            ->groupBy('pedido_produtos.produto_sku')
            ->groupBy('pedidos.status')
            ->orderBy('pedido_produtos.produto_sku')
            ->get()
            ->toArray();

        $attachedProducts = [];
        foreach ($reservados as $item) {
            $attachedProducts[$item['produto_sku']][$item['status']] = $item['count'];
        }

        foreach ($list as $item) {
            $item->attachedProducts = [
                (isset($attachedProducts[$item->sku][0]) ? $attachedProducts[$item->sku][0] : 0),
                (isset($attachedProducts[$item->sku][1]) ? $attachedProducts[$item->sku][1] : 0)
            ];
        }

        return $this->listResponse(ProductTransformer::list($list));
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $product = (self::MODEL)
            ::with([
                'productStocks',
                'pedidoProdutos'    => function ($query) {
                    $query->with(['pedido']);
                    $query->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id');
                    $query->whereIn('pedidos.status', [0,1]);
                    $query->orderBy('pedidos.status', 'ASC');
                },
                'inspecoesTecnicas' => function ($query) {
                    $query->whereNull('inspecao_tecnica.pedido_produtos_id');
                    $query->whereNotNull('inspecao_tecnica.revisado_at');
                },
            ])
            ->where('produtos.sku', '=', $id)
            ->first();

        if (!$product) {
            return $this->notFoundResponse();
        }

        return $this->showResponse(ProductTransformer::show($product));
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function gerenateSku($oldSku = null)
    {
        try {
            if (!$oldSku) {
                $data = new Produto();
            } else {
                $data = (self::MODEL)::find($oldSku);
                if (!$data) {
                    return $this->notFoundResponse();
                }

                $last = Produto::orderBy('sku', 'DESC')->take(1)->first();

                if ($last && $last->sku) {
                    $last = (int)$last->sku;
                    $last++;
                } else {
                    throw new \Exception('Não foi possível encontrar o último SKU válido!', 1);
                }
                $data->sku = $last;

                DB::unprepared('ALTER TABLE ' . $data->getTable() . ' AUTO_INCREMENT = ' . ($last + 1) . ';');
            }

            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Check if sku exists
     *
     * @param  int $sku
     * @return bool      if exists
     */
    public function checkSku($sku)
    {
        try {
            if ($produto = Produto::find($sku)) {
                return $this->showResponse(['exists' => true]);
            }
        } catch (\Exception $exception) {
        }

        return $this->showResponse([
            'exists' => false
        ]);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = (self::MODEL)::create(Input::all());

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        if (!$data = (self::MODEL)::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $data->fill(Input::except(['atributos']));
            $data->save();

            /*$attrs = Input::get('atributos');
            if ($attrs) {
                $data->atributos()->detach();

                $atributos = [];
                foreach ($attrs as $attr) {
                    $atributos[] = [
                        'produto_sku' => (isset($attr['pivot']['produto_sku']) && $attr['pivot']['produto_sku']) ? $attr['pivot']['produto_sku'] : $data->sku,
                        'atributo_id' => (isset($attr['pivot']['atributo_id']) && $attr['pivot']['atributo_id']) ? $attr['pivot']['atributo_id'] : $attr['id'],
                        'opcao_id'    => (isset($attr['pivot']['opcao_id']) && $attr['pivot']['opcao_id']) ? $attr['pivot']['opcao_id']          : null,
                        'valor'       => (isset($attr['pivot']['valor']) && $attr['pivot']['valor']) ? $attr['pivot']['valor']                   : null
                    ];
                }
                $data->atributos()->attach($atributos);
            }*/

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Busca produtos por sku ou titulo baseado no parametro
     *
     * @param  string $term termo a ser buscado
     * @return Object
     */
    public function search($term)
    {
        try {
            $estado = Input::get('estado');
            $estado = $estado ?: false;

            if ($estado) {
                $list = Produto::where('estado', '=', $estado);
                $list->whereRaw("(titulo LIKE '%{$term}%' OR sku LIKE '%{$term}%')");
            } else {
                $list = Produto::where('titulo', 'LIKE', "%{$term}%")->orWhere('sku', 'LIKE', "%{$term}%");
            }

            $list = $list->get(['produtos.sku', 'produtos.titulo'])->toArray();

            return $this->listResponse($list);
        } catch (\Exception $exception) {
            return $this->listResponse([]);
        }
    }
}
