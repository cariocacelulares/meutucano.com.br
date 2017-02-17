<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
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
                    'ok'      => false,
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
                    'ok'      => false,
                ]);
            }

            $order = Pedido
                ::join('pedido_produtos', 'pedido_produtos.pedido_id', 'pedidos.id')
                ->where('pedido_produtos.product_imei_id', '=', $productImei->id)
                ->whereIn('pedidos.status', [2, 3])
                ->orderBy('pedidos.created_at', 'DESC')
                ->first();

            if ($order) {
                return $this->listResponse([
                    'icon'    => 'exclamation',
                    'message' => 'Imei já faturado!',
                    'ok'      => false,
                ]);
            }

            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Imei disponível!',
                'ok'      => true,
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Não foi possível verificar o imei!'));

            return $this->listResponse([
                'icon'    => 'times',
                'message' => 'Não foi possível verificar o imei!',
                'ok'      => false,
            ]);
        }
    }
}
