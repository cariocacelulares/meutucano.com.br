<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto;
use Core\Models\Produto\ProductImei;
use Core\Transformers\ProductImeiTransformer;

/**
 * Class ProductImeiController
 * @package Core\Http\Controllers\Produto
 */
class ProductImeiController extends Controller
{
    use RestControllerTrait;

    const MODEL = ProductImei::class;

    /**
     * Returns a list of ProductImei filtered by sku
     *
     * @param  int $sku
     * @return Response
     */
    public function listBySku($sku)
    {
        try {
            $product = Produto::findOrFail($sku);

            $productImeis = (self::MODEL)
                ::with(['productStock', 'productStock.stock'])
                ->join('product_stocks', 'product_imeis.product_stock_id', 'product_stocks.id')
                ->leftJoin('pedido_produtos', 'product_imeis.id', 'pedido_produtos.product_imei_id')
                ->leftJoin('pedidos', 'pedido_produtos.pedido_id', 'pedidos.id')
                ->where('product_stocks.product_sku', '=', $sku)
                ->where(function ($query) {
                    $query->whereNotIn('pedidos.status', [0, 1, 2, 3]);
                    $query->orWhereNull('pedidos.status');
                })
                ->orderBy('product_imeis.created_at', 'DESC')
                ->get(['product_imeis.*']);

            return $this->listResponse(ProductImeiTransformer::listBySku($productImeis));
        } catch (\Exception $exception) {
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
            $data->fill(Input::all());
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Parse imeis and get each product info
     *
     * @return Response
     */
    public function parseImeis()
    {
        $imeis = Input::get('imeis');

        try {
            $products   = [];
            $registered = [];
            $imeis      = explode(PHP_EOL, $imeis);

            foreach ($imeis as $key => $imei) {
                $imei = trim($imei);

                if (array_search($imei, $registered) !== false) {
                    continue;
                }

                if ($imei) {
                    $imei = ProductImei
                        ::with([
                            'productStock',
                            'productStock.stock',
                            'productStock.product',
                        ])
                        ->where('imei', '=', $imei)
                        ->first();
                }

                if ($imei) {
                    $products[] = [
                        'imei'             => $imei->imei,
                        'product_imei_id'  => $imei->id,
                        'product_stock_id' => $imei->productStock->id,
                        'stock'            => $imei->productStock->stock->title,
                        'sku'              => $imei->productStock->product->sku,
                        'title'            => $imei->productStock->product->titulo,
                    ];

                    $registered[] = $imei->imei;
                }
            }

            return $this->listResponse([
                'products' => $products
            ]);
        } catch (\Exception $exception) {
        }

        return $this->listResponse([
            'products' => []
        ]);
    }
}
