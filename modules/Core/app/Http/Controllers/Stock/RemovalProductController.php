<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\ProductImei;
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

    public function verify($imei)
    {
        try {
            $productImei = ProductImei
                ::where('imei', '=', $imei)
                ->first();

            if (!$productImei) {
                return $this->listResponse([
                    'icon'    => 'ban',
                    'message' => 'Imei não registrado!',
                ]);
            }

            $removalProduct = RemovalProduct
                ::where('product_imei_id', '=', $productImei->id)
                ->where('status', '!=', 3)
                ->first();

            if ($removalProduct) {
                return $this->listResponse([
                    'icon'    => 'shopping-cart',
                    'message' => "Imei em aberto na retirada #{$removalProduct->stock_removal_id}",
                ]);
            }

            $orderProducts = $productImei->pedidoProdutos
                ->whereIn('status', [2, 3])
                ->orderBy('created_at', 'DESC')
                ->first();

            if ($orderProducts) {
                return $this->listResponse([
                    'icon'    => 'exclamation',
                    'message' => 'Imei já faturado!',
                ]);
            }

            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Imei disponível!',
            ]);
        } catch (\Exception $exception) {
            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Imei disponível!',
            ]);
        }
    }
}
