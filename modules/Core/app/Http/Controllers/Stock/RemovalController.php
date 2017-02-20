<?php namespace Core\Http\Controllers\Stock;

use Carbon\Carbon;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Stock\Removal;
use Core\Models\Stock\RemovalProduct;
use Core\Http\Requests\Stock\RemovalRequest as Request;
use Core\Transformers\StockRemovalTransformer;

/**
 * Class RemovalController
 * @package Core\Http\Controllers\Stock
 */
class RemovalController extends Controller
{
    use RestControllerTrait;

    const MODEL = Removal::class;

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)
            ::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(StockRemovalTransformer::list($list));
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $removal = (self::MODEL)
                ::create(Input::except('removal_products'));

            $removalProducts = [];
            foreach (Input::get('removal_products') as $product) {
                $removalProducts = [
                    'product_stock_id' => $product['product_stock_id'],
                    'product_imei_id'  => $product['product_imei_id'],
                    'stock_removal_id' => $removal->id,
                ];

                RemovalProduct::insert($removalProducts);
            }

            return $this->createdResponse($removal);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        try {
            $removal = (self::MODEL)::findOrFail($id);
            $removal->fill(Input::except('removal_products'));
            $removal->save();

            $removalProducts = [];
            foreach (Input::get('removal_products') as $product) {
                $removalProducts = [
                    'product_stock_id' => $product['product_stock_id'],
                    'product_imei_id'  => $product['product_imei_id'],
                    'stock_removal_id' => $removal->id,
                ];

                RemovalProduct::insert($removalProducts);
            }

            return $this->showResponse($removal);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $removal = (self::MODEL)
                ::with([
                    'removalProducts',
                    'removalProducts.productImei',
                    'removalProducts.productStock',
                    'removalProducts.productStock.stock',
                    'removalProducts.productStock.product',
                    'removalProducts.productStock.product.productStocks',
                    'removalProducts.productStock.product.productStocks.stock',
                ])
                ->findOrFail($id);

            return $this->showResponse(StockRemovalTransformer::show($removal));
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Verify and closes a stock removal
     *
     * @param  int $id
     * @return Response
     */
    public function close($id)
    {
        $this->refresh($id);

        $stockRemoval = (self::MODEL)::findOrFail($id);

        $openProducts = $stockRemoval->removalProducts->whereIn('status', [0, 1]);

        if ($openProducts->count()) {
            return $this->validationFailResponse([
                'Existem produtos que não foram faturados ou devolvidos ao estoque!'
            ]);
        }

        $stockRemoval->closed_at = Carbon::now();
        $stockRemoval->save();

        return $this->showResponse($stockRemoval);
    }

    /**
     * Check if stock removal products is sent and refresh status
     *
     * @param  int $id
     * @return Response
     */
    public function refresh($id)
    {
        $stockRemoval = (self::MODEL)::findOrFail($id);
        $i = 0;

        try {
            $openProducts = $stockRemoval->removalProducts->where('status', '=', 1);

            foreach ($openProducts as $removalProduct) {
                if ($removalProduct->product_imei_id) {
                    $orderProduct = PedidoProduto
                        ::join('pedidos', 'pedidos.id', 'pedido_produtos.pedido_id')
                        ->where('product_imei_id', '=', $removalProduct->product_imei_id)
                        ->where('product_stock_id', '=', $removalProduct->product_stock_id)
                        ->whereIn('status', [2, 3])
                        ->count();

                    if ($orderProduct) {
                        $removalProduct->status = 2;
                        $removalProduct->save();
                        $i++;
                    }
                } else {
                    $orderProduct = PedidoProduto
                        ::join('pedidos', 'pedidos.id', 'pedido_produtos.pedido_id')
                        ->where('produto_sku', '=', $removalProduct->product_sky)
                        ->where('product_stock_id', '=', $removalProduct->product_stock_id)
                        ->whereIn('status', [2, 3])
                        ->count();

                    if ($orderProduct >= $removalProduct->quantity) {
                        $removalProduct->status = 2;
                        $removalProduct->save();
                        $i++;
                    }
                }
            }
        } catch (Exception $exception) {
            \Log::warning(logMessage($exception, 'Ocorreu um erro ao tentar atualizar o status dos produtos da retirada de estoque'));
        }

        return $this->showResponse($i);
    }
}
