<?php namespace Core\Http\Controllers\Relatorio;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto;
use Core\Models\Produto\ProductImei;
use Core\Http\Controllers\Traits\RelatorioTrait;

/**
 * Class InventarioController
 * @package Core\Http\Controllers\Relatorio
 */
class InventarioController extends Controller
{
    use RestResponseTrait, RelatorioTrait;

    public function relatorio($return_type = 'array')
    {
        $this->middleware('permission:report_inventory');

        $this->list      = [];
        $productImeiList = [];

        try {
            $params = (array) json_decode(Input::get('params'));
            if ($params) {
                if (isset($params['skus'])) {
                    $skus  = $params['skus'];
                    $stock = $params['stock'];
                }
            } else {
                $skus  = Input::get('skus');
                $stock = Input::get('stock');
            }

            if ($skus) {
                foreach ($skus as $sku) {
                    $sku     = is_array($sku) ? array_values($sku)[0] : $sku->text;
                    $product = Produto::find($sku);

                    if (!$product) {
                        continue;
                    }

                    $productImeiList[] = ProductImei
                        ::with(['productStock', 'productStock.stock', 'productStock.product'])
                        ->join('product_stocks', 'product_imeis.product_stock_id', 'product_stocks.id')
                        ->leftJoin('pedido_produtos', 'product_imeis.id', 'pedido_produtos.product_imei_id')
                        ->leftJoin('pedidos', 'pedido_produtos.pedido_id', 'pedidos.id')
                        ->where('product_stocks.stock_slug', '=', $stock)
                        ->where('product_stocks.product_sku', '=', $sku)
                        ->where(function ($query) {
                            $query->whereNotIn('pedidos.status', [0, 1, 2, 3]);
                            $query->orWhereNull('pedidos.status');
                        })
                        ->where(
                            \DB::raw('(
                                SELECT COUNT(*)
                                FROM pedido_produtos p1
                                    JOIN pedidos o1 ON p1.pedido_id = o1.id
                                WHERE p1.product_imei_id = product_imeis.id
                                    AND (o1.status IN (0,1,2,3) OR o1.status IS NULL)
                            )'),
                            '=',
                            0
                        )
                        ->orderBy('product_imeis.created_at', 'DESC')
                        ->select(['product_imeis.*'])
                        ->get();
                }
            } else {
                $productImeiList[] = ProductImei
                    ::with(['productStock', 'productStock.stock', 'productStock.product'])
                    ->join('product_stocks', 'product_imeis.product_stock_id', 'product_stocks.id')
                    ->leftJoin('pedido_produtos', 'product_imeis.id', 'pedido_produtos.product_imei_id')
                    ->leftJoin('pedidos', 'pedido_produtos.pedido_id', 'pedidos.id')
                    ->where('product_stocks.stock_slug', '=', $stock)
                    ->where(function ($query) {
                        $query->whereNotIn('pedidos.status', [0, 1, 2, 3]);
                        $query->orWhereNull('pedidos.status');
                    })
                    ->where(
                        \DB::raw('(
                            SELECT COUNT(*)
                            FROM pedido_produtos p1
                                JOIN pedidos o1 ON p1.pedido_id = o1.id
                            WHERE p1.product_imei_id = product_imeis.id
                                AND (o1.status IN (0,1,2,3) OR o1.status IS NULL)
                        )'),
                        '=',
                        0
                    )
                    ->orderBy('product_stocks.product_sku', 'ASC')
                    ->orderBy('product_imeis.created_at', 'DESC')
                    ->select(['product_imeis.*'])
                    ->get();
            }

            foreach ($productImeiList as $productImeis) {
                foreach ($productImeis as $productImei) {
                    $this->list[] = [
                        'sku'    => $productImei->productStock->product->sku,
                        'imei'   => $productImei->imei,
                        'titulo' => $productImei->productStock->product->titulo,
                    ];
                }
            }

            if (in_array($return_type, ['xls', 'pdf'])) {
                return $this->getFile($return_type);
            } else {
                return $this->listResponse($this->list);
            }
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Erro ao tentar gerar relatório'));

            return $this->notFoundResponse();
        }
    }
}
