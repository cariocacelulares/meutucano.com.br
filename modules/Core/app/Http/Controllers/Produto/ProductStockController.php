<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
use Core\Models\Stock;
use Core\Models\Stock\RemovalProduct;
use Core\Models\Produto;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;
use Core\Transformers\ProductStockTransformer;

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
     * Returns a list of ProductStock filtered by slug
     *
     * @param  int $slug
     * @return Response
     */
    public function listBySlug($slug)
    {
        try {
            $productStocks = (self::MODEL)
                ::with(['product'])
                ->join('produtos', 'produtos.sku', 'product_stocks.product_sku')
                ->where('stock_slug', '=', $slug)
                ->orderBy('quantity', 'DESC');

            $productStocks = $this->handleRequest($productStocks);

            return $this->listResponse(ProductStockTransformer::listBySlug($productStocks));
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
            $duplicate  = [];

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

                            $productImei = ProductImei
                                ::where('imei', $imei)
                                ->withTrashed()
                                ->first();

                            if (!$productImei) {
                                $productImeis[] = new ProductImei([
                                    'imei' => $imei,
                                ]);
                            } else if (!is_null($productImei->deleted_at)) {
                                $productImei->restore();
                                $productImei->product_stock_id = $productStock->id;
                                $productImei->save();
                            } else {
                                $duplicate[] = $imei;
                            }
                        }

                        $productStock->productImeis()->saveMany(array_unique($productImeis));
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

            if ($duplicate) {
                return $this->validationFailResponse([
                    'O(s) seriai(s) ' . implode(', ', $duplicate) . ' não foram registrado neste produto pois pertencem a outro.'
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

    /**
     * Returns a list of product stocks available to add to given product
     *
     * @param  int $sku
     * @return Response
     */
    public function addOptions($sku)
    {
        $product = Produto::findOrFail($sku);

        $options = Stock
            ::whereDoesntHave('productStocks', function($query) use ($sku) {
                $query->where('product_sku', '=', $sku);
            })->get();

        return $this->listResponse($options);
    }

    /**
     * Returns a list of product stocks available to transfer from the given stock
     *
     * @param  int $id
     * @return Response
     */
    public function transferOptions($id)
    {
        $productStock = ProductStock::findOrFail($id);

        $options = ProductStock
            ::with('stock')
            ->where('serial_enabled', '=', $productStock->serial_enabled)
            ->where('product_sku', '=', $productStock->product_sku)
            ->where('id', '!=', $productStock->id)
            ->get();

        return $this->listResponse($options);
    }

    /**
     * Transfer $qty of products $from $to
     *
     * @param  ProductStock $from
     * @param  ProductStock $to
     * @param  int          $qty
     * @return boolean|Response
     */
    private function transferQty(ProductStock $from, ProductStock $to, $qty)
    {
        if (!$qty) {
            return $this->validationFailResponse([
                'Nenhuma quantidade foi informada.'
            ]);
        }

        if ($qty > $from->quantity) {
            return $this->validationFailResponse([
                'A quantidade que você está tentando transferir é maior que a que o estoque de origem possui.'
            ]);
        }

        DB::beginTransaction();
        Log::debug('Transaction - begin');

        try {
            $from->quantity = $from->quantity - $qty;
            $to->quantity   = $to->quantity + $qty;

            if (!$from->save() || !$to->save()) {
                throw new \Exception('Erro ao salvar recursos', 1);
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::debug('Transaction - rollback');
            Log::warning('Não foi possível realizar a transferência de estoque!', [
                'from'     => $from->id,
                'to'       => $to->id,
                'from_qty' => $from->quantity,
                'to_qty'   => $to->quantity,
                'qty'      => $qty,
            ]);

            return false;
        }

        DB::commit();
        Log::debug('Transaction - commit');
        Log::info('Transferencia de estoque realizada com sucesso', [
            'from'     => $from->id,
            'to'       => $to->id,
            'from_qty' => $from->quantity,
            'to_qty'   => $to->quantity,
            'qty'      => $qty,
        ]);

        return true;
    }

    /**
     * Transfer $imeis of products $from $to
     *
     * @param  ProductStock $from
     * @param  ProductStock $to
     * @param  array        $imeis
     * @return boolean|Response
     */
    private function transferImeis(ProductStock $from, ProductStock $to, array $imeis)
    {
        if (!$imeis || empty($imeis)) {
            return $this->validationFailResponse([
                'Nenhum serial foi informado ou são inválidos.'
            ]);
        }

        DB::beginTransaction();
        Log::debug('Transaction - begin');

        try {
            foreach ($imeis as $imei) {
                $error = false;

                $productImei = ProductImei
                    ::where('imei', '=', $imei)
                    ->first();

                if (!$productImei) {
                    $error = 'Os estoques de destino e origem não possuem a mesma opção de controle serial!';
                }

                if ('product_stock_id' != $from->id) {
                    $error = 'Os estoques de destino e origem não possuem a mesma opção de controle serial!';
                }

                $productImei->product_stock_id = $to->id;
                $from->quantity                = $from->quantity - 1;
                $to->quantity                  = $to->quantity + 1;

                if (!$productImei->save() || !$from->save() || !$to->save()) {
                    throw new \Exception('Erro ao salvar recursos', 1);
                }
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::debug('Transaction - rollback');
            Log::warning(logMessage($exception, 'Erro ao tentar realizar uma transferencia de estoque'), [
                'from'     => $from->id,
                'to'       => $to->id,
                'from_qty' => $from->quantity,
                'to_qty'   => $to->quantity,
                'imeis'    => $imeis,
            ]);

            return false;
        }

        DB::commit();
        Log::debug('Transaction - commit');
        Log::info('Transferencia de estoque realizada com sucesso', [
            'from'     => $from->id,
            'to'       => $to->id,
            'from_qty' => $from->quantity,
            'to_qty'   => $to->quantity,
            'imeis'    => $imeis,
        ]);

        return true;
    }

    /**
     * Verify if transfer is enabled and do it
     *
     * @return Response
     */
    public function transfer()
    {
        $from  = Input::get('from');
        $to    = Input::get('to');
        $qty   = Input::get('qty');

        $imeis = [];
        foreach ((Input::get('imeis') ?: []) as $imei) {
            if (trim($imei)) {
                $imeis[] = trim($imei);
            }
        }

        $from = ProductStock::findOrFail($from);
        $to   = ProductStock::findOrFail($to);

        if ($from->serial_enabled !== $to->serial_enabled) {
            return $this->validationFailResponse([
                'Os estoques de destino e origem não possuem a mesma opção de controle serial!'
            ]);
        }

        if ($from->serial_enabled) {
            $return = $this->transferImeis($from, $to, $imeis);
        } else {
            $return = $this->transferQty($from, $to, $qty);
        }

        return $this->showResponse($return);
    }

    /**
     * Verifica se um $imei pode ser transferido de um product stock $id
     *
     * @param  int $id
     * @param  string $imei
     * @return Response
     */
    public function verifyTransfer($id, $imei)
    {
        try {
            $productStock = ProductStock::findOrFail($id);

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

            if ($productImei->product_stock_id != $productStock->id) {
                return $this->listResponse([
                    'icon'    => 'exclamation',
                    'message' => 'Serial não pertence ao estoque selecionado!',
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
                    'icon'    => 'cart-arrow-down',
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
}
