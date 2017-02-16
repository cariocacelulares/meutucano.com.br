<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
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

        return $this->listResponse($list);
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
                ::create(Input::except('products'));

            $products = Input::get('products');
            if ($products) {
                if (isset($products['sku']) && $products['sku']) {
                    $removalProducts = [];
                    foreach ($products['sku'] as $product) {
                        $removalProducts = [
                            'product_stock_id' => $product['product_stock_id'],
                            'quantity'         => $product['quantity'],
                            'stock_removal_id' => $removal->id,
                        ];

                        RemovalProduct::insert($removalProducts);
                    }
                }

                if (isset($products['imei']) && $products['imei']) {
                    $removalProducts = [];
                    foreach ($products['imei'] as $product) {
                        $removalProducts = [
                            'product_stock_id' => $product['product_stock_id'],
                            'product_imei_id'  => $product['product_imei_id'],
                            'stock_removal_id' => $removal->id,
                        ];

                        RemovalProduct::insert($removalProducts);
                    }
                }
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
            $data = (self::MODEL)::findOrFail($id);
            $data->fill(Input::except('removal_products'));
            $data->save();

            $products = Input::get('removal_products');
            if ($products) {
                if (isset($products['sku']) && $products['sku']) {
                    $removalProducts = [];
                    foreach ($products['sku'] as $product) {
                        if (isset($product['id']) && $product['id']) {
                            if ($removalProduct = RemovalProduct::find($product['id'])) {
                                $removalProduct->quantity         = $product['quantity'];
                                $removalProduct->product_stock_id = $product['product_stock_id'];

                                $removalProduct->save();
                            }
                        } else {
                            $removalProducts = [
                                'product_stock_id' => $product['product_stock_id'],
                                'quantity'         => $product['quantity'],
                                'stock_removal_id' => $removal->id,
                            ];

                            RemovalProduct::insert($removalProducts);
                        }
                    }
                }

                if (isset($products['imei']) && $products['imei']) {
                    $removalProducts = [];
                    foreach ($products['imei'] as $product) {
                        $removalProducts = [
                            'product_stock_id' => $product['product_stock_id'],
                            'product_imei_id'  => $product['product_imei_id'],
                            'stock_removal_id' => $removal->id,
                        ];

                        RemovalProduct::insert($removalProducts);
                    }
                }
            }

            return $this->showResponse($data);
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
}
