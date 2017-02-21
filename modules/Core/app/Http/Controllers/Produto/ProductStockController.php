<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;

/**
 * Class ProductStockController
 * @package Core\Http\Controllers\Produto
 */
class ProductStockController extends Controller
{
    use RestControllerTrait;

    const MODEL = ProductStock::class;

    /**
     * Returns a list of ProductStock filtered by sku
     *
     * @return Response
     */
    public function refresh()
    {
        try {
            foreach (Input::all() as $productStockData) {
                $productStock = (self::MODEL)::find($productStockData['id']);

                if ($productStock) {
                    if ($productStockData['serial_enabled'] !== $productStock->serial_enabled) {
                        $productStock->serial_enabled = $productStockData['serial_enabled'];
                    }

                    if (!$productStock->serial_enabled) {
                        if ($productStockData['quantity'] !== $productStock->quantity) {
                            $productStock->quantity = $productStockData['quantity'];
                        }
                    }

                    if ($productStock->getDirty()) {
                        $productStock->save();
                    }
                }
            }

            return $this->showResponse([
                'updated' => true
            ]);
        } catch (\Exception $exception) {
            \Log::error('Erro ao tentar atualizar as informações de estoque');

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Returns a list of ProductStock filtered by sku
     *
     * @param  int $sku
     * @return Response
     */
    public function listBySku($sku)
    {
        try {
            $productStocks = (self::MODEL)
                ::with('stock')
                ->join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
                ->where('product_sku', '=', $sku)
                ->orderBy('stocks.priority', 'ASC')
                ->get();

            return $this->listResponse($productStocks);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Stock entry
     *
     * @return response
     */
    public function entry()
    {
        try {
            $sku        = Input::get('sku');
            $stock_slug = Input::get('stock_slug');

            if ($sku && $stock_slug) {
                $quantity = Input::get('quantity');
                $imeis    = Input::get('imeis');

                $productStock = ProductStock
                    ::where('product_sku', '=', $sku)
                    ->where('stock_slug', '=', $stock_slug)
                    ->first();

                if ($productStock->serial_enabled) {
                    if ($imeis) {
                        $productImeis = [];
                        $imeis        = explode(PHP_EOL, $imeis);
                        foreach ($imeis as $imei) {
                            $imei = trim($imei);

                            if (!$imei) {
                                continue;
                            }

                            $productImeis[] = new ProductImei([
                                'imei' => $imei,
                            ]);
                        }

                        $productStock->productImeis()->saveMany($productImeis);
                    } else {
                        return $this->validationFailResponse([
                            'O estoque que você selecionou possui controle de serial e os seriais não foram informados.'
                        ]);
                    }
                } elseif (!$productStock->serial_enabled) {
                    if ($quantity) {
                        $productStock->quantity = $productStock->quantity + $quantity;
                        $productStock->save();
                    } else {
                        return $this->validationFailResponse([
                            'A quantidade não foi informada.'
                        ]);
                    }
                }
            } else {
                return $this->validationFailResponse([
                    'Não foi possível encontrar os identificadores do produto e do estoque.'
                ]);
            }

            return $this->showResponse([
                'saved' => true
            ]);
        } catch (\Illuminate\Database\QueryException $exception) {
            // Tenta encontrar o imei que violou a unique key e informa ao usuario
            if (strstr($exception->getMessage(), 'Duplicate entry')) {
                if ($pos = strpos($exception->getMessage(), 'Duplicate entry')) {
                    $substring = substr($exception->getMessage(), ($pos + 17));

                    if ($pos = strpos($substring, "'")) {
                        $duplicado = substr($substring, 0, $pos);

                        if ($duplicado) {
                            return $this->validationFailResponse([
                                "O serial {$duplicado} já foi utilizado!"
                            ]);
                        }
                    }
                }
            }
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao dar entrada no estoque'));

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }

        return $this->notFoundResponse();
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
            $productStock = (self::MODEL)::findOrFail($id);

            $data = Input::all();

            if (isset($data['quantity'])
                && $data['quantity'] !== $productStock->quantity
                && $productStock->serial_enabled
            ) {
                unset($data['quantity']);
            }

            $productStock->fill($data);
            $productStock->save();

            return $this->showResponse($productStock);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
