<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
use Core\Models\Produto\ProductImei;
use Core\Models\Stock\Removal;
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

    /**
     * Verify imei status when add to a stock removal
     *
     * @param  string $imei
     * @return Response
     */
    public function verify($imei)
    {
        try {
            $productImei = ProductImei
                ::where('imei', '=', $imei)
                ->first();

            if (!$productImei) {
                return $this->listResponse([
                    'icon'    => 'ban',
                    'message' => 'Serial não registrado!',
                    'ok'      => false,
                ]);
            }

            $removalProduct = RemovalProduct
                ::where('product_imei_id', '=', $productImei->id)
                ->whereNotIn('status', [2, 3])
                ->first();

            if ($removalProduct) {
                return $this->listResponse([
                    'icon'    => 'shopping-cart',
                    'message' => "Serial em aberto na retirada #{$removalProduct->stock_removal_id}",
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
                    'message' => 'Serial já faturado!',
                    'ok'      => false,
                ]);
            }

            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Serial disponível!',
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

    /**
     * Check if imei is able to be confirmed in stock removal_products
     *
     * @param  string $imei
     * @param  int $stockRemovalId
     * @return Response
     */
    public function check($imei, $stockRemovalId)
    {
        try {
            $productImei = ProductImei
                ::where('imei', '=', $imei)
                ->first();

            if (!$productImei) {
                return $this->listResponse([
                    'icon'    => 'ban',
                    'message' => 'Serial não registrado!',
                    'ok'      => false,
                ]);
            }

            $removalProduct = RemovalProduct
                ::where('product_imei_id', '=', $productImei->id)
                ->where('status', '!=', 3)
                ->first();

            if (!$removalProduct) {
                return $this->listResponse([
                    'icon'    => 'times',
                    'message' => 'Serial não registrado em uma retirada!',
                    'ok'      => false,
                ]);
            }

            if ($removalProduct->stock_removal_id != $stockRemovalId) {
                return $this->listResponse([
                    'icon'    => 'exclamation',
                    'message' => 'O serial não está registrado nesta retirada!',
                    'ok'      => false,
                ]);
            }

            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Serial disponível p/ confirmação!',
                'ok'      => true,
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Não foi possível verificar o serial!'));

            return $this->listResponse([
                'icon'    => 'times',
                'message' => 'Não foi possível verificar o serial!',
                'ok'      => false,
            ]);
        }
    }

    /**
     * Update status
     *
     * @param  int $stockRemovalId
     * @param  int $status          new status
     * @return Response
     */
    private function updateStatus($stockRemovalId, $status)
    {
        $stockRemoval = Removal::findOrFail($stockRemovalId);
        $itens        = Input::get('itens');

        try {
            if ($itens) {
                if (!is_array($itens)) {
                    $itens = [$itens];
                }

                $update = (self::MODEL)
                    ::whereIn('id', $itens)
                    ->where('stock_removal_id', '=', $stockRemoval->id)
                    ->update([
                        'status' => $status
                    ]);

                return $this->listResponse([
                    'count' => $update
                ]);
            }
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Não foi possível alterar o status dos produtos da retirada ' . $stockRemoval->id), [$itens]);
        }

        return $this->listResponse([
            'count' => 0
        ]);
    }

    /**
     * Change stock removal product status to 1 - Entregue
     *
     * @param  int $stockRemovalId
     * @return Response
     */
    public function confirm($stockRemovalId)
    {
        return $this->updateStatus($stockRemovalId, 1);
    }

    /**
     * Change stock removal product status to 3 - Retornado
     *
     * @param  int $stockRemovalId
     * @return Response
     */
    public function return($stockRemovalId)
    {
        return $this->updateStatus($stockRemovalId, 3);
    }
}
