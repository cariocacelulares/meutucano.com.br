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
            $openRemoval = (self::MODEL)
                ::where('user_id', '=', Input::get('user_id'))
                ->whereNull('closed_at')
                ->first();

            if ($openRemoval) {
                return $this->validationFailResponse([
                    'Este usuário possui uma retirada em aberto!'
                ]);
            }

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
}
