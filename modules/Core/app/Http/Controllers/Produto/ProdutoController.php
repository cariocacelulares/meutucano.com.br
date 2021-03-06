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
            ::orderBy('produtos.created_at', 'DESC');

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
        $product = (self::MODEL)
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
            $product = (self::MODEL)::create(Input::all());

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
        if (!$product = (self::MODEL)::find($id)) {
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

    /**
     * Get produto info and stocks by sku
     *
     * @param  int $sku
     * @return Response
     */
    public function getStocks($sku)
    {
        $product = Produto
            ::where('sku', '=', $sku)
            ->with([
                'productStocks',
                'productStocks.stock',
            ])
            ->first();

        if ($product) {
            try {
                $product = [
                    'sku'           => $product->sku,
                    'title'         => $product->titulo,
                    'productStocks' => $product->productStocks,
                ];

                return $this->showResponse([
                    'produto' => $product
                ]);
            } catch (\Exception $exception) {
            }
        }

        return $this->showResponse([
            'produto' => []
        ]);
    }

    /**
     * Upload image files
     *
     * @return Response
     */
    public function upload()
    {
        $files = Input::file('files');

        try {
            $return = [];
            foreach ($files as $file) {
                if (in_array($file->getMimetype(), ['image/jpeg']) === false) {
                    $return['error'][] = [
                        'file'    => $file->getClientOriginalName(),
                        'message' => 'O arquivo precisa estar no formato JPG'
                    ];

                    continue;
                }

                if (($file->getSize() / 1000) > 800) {
                    $return['error'][] = [
                        'file'    => $file->getClientOriginalName(),
                        'message' => 'O arquivo precisa ter menos de 800KB'
                    ];

                    continue;
                }

                $fileName = str_slug(
                    substr($file->getClientOriginalName(), 0, -3)
                ) . uniqid('_') . '.jpg';
                $file->move(storage_path('app/public/produto'), $fileName);

                $return['success'][] = [
                    'file' => $fileName
                ];
            }

            return $this->createdResponse($return);
        } catch (\Exception $e) {
            return $this->clientErrorResponse([
                'error'   => true,
                'message' => 'Não foi possível fazer upload dos arquivos, tente novamente!',
                'exception' => $e->getMessage() . '  ' . $e->getLine()
            ]);
        }
    }
}
