<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto;
use Core\Models\Pedido\PedidoProduto;
use Core\Http\Requests\ProdutoRequest as Request;
use Core\Transformers\ProductTransformer;
use Core\Models\Produto\Image;

/**
 * Class ProdutoController
 * @package Core\Http\Controllers\Produto
 */
class ProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Produto::class;

    public function __construct()
    {
        $this->middleware('permission:product_list', ['only' => ['index']]);
        $this->middleware('permission:product_show', ['only' => ['show']]);
        $this->middleware('permission:product_create', ['only' => ['store']]);
        $this->middleware('permission:product_update', ['only' => ['update']]);
        $this->middleware('permission:product_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista produtos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:product_list');

        $list = Produto::orderBy('produtos.created_at', 'DESC');
        $list = $this->handleRequest($list);

        $ids = [];
        foreach ($list as $item) {
            $ids[] = $item->sku;
        }

        $reservados = PedidoProduto::select('pedido_produtos.produto_sku', 'pedidos.status', DB::raw('COUNT(*) as count'))
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

        return $this->listResponse(ProductTransformer::tableList($list));
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $product = Produto
            ::where('produtos.sku', '=', $id)
            ->first();

        if (!$product) {
            return $this->notFoundResponse();
        }

        return $this->showResponse(ProductTransformer::show($product));
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $product = Produto::create(Input::all());

            return $this->createdResponse($product);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update(Request $request, $id)
    {
        if (!$product = Produto::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $product->fill(Input::all());
            $product->save();

            return $this->showResponse($product);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
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
        $this->middleware('permission:product_list');

        try {
            $estado = Input::get('estado');
            $estado = $estado ?: false;

            if ($estado) {
                $list = Produto::where('estado', '=', $estado);
                $list->whereRaw("(titulo LIKE '%{$term}%' OR sku LIKE '%{$term}%')");
            } else {
                $list = Produto::where('titulo', 'LIKE', "%{$term}%")->orWhere('sku', 'LIKE', "%{$term}%");
            }

            $list = $list->get([
                'produtos.sku',
                'produtos.titulo',
                'produtos.valor',
                'produtos.ean',
                'produtos.ncm',
            ])->toArray();

            return $this->listResponse($list);
        } catch (\Exception $exception) {
            return $this->listResponse([]);
        }
    }
}
