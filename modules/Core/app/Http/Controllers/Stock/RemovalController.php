<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock\Removal;
use Core\Models\Stock\RemovalProduct;
use Core\Http\Requests\Stock\RemovalRequest as Request;

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
}
