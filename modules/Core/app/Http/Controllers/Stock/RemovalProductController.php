<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock\RemovalProduct;
use Core\Transformers\StockRemovalProductTransformer;

/**
 * Class RemovalProductController
 * @package Core\Http\Controllers\Stock
 */
class RemovalProductController extends Controller
{
    use RestControllerTrait;

    const MODEL = RemovalProduct::class;

    /**
     * Change stock removal product status
     *
     * @param  int $id
     * @return Response
     */
    public function changeStatus($id)
    {
        $removalProduct = (self::MODEL)::findOrFail($id);

        $status = (int) Input::get('status');
        if ($status !== null && isset(\Config::get('core.stock_removal_status')[$status])) {
            $removalProduct->status = $status;
            $removalProduct->save();
        }

        $removalProduct = $removalProduct
            ->with([
                'productImei',
                'productStock',
                'productStock.stock',
                'productStock.product',
                'productStock.product.productStocks',
                'productStock.product.productStocks.stock',
            ])
            ->find($removalProduct->id);

        return $this->showResponse(StockRemovalProductTransformer::show($removalProduct));
    }
}
