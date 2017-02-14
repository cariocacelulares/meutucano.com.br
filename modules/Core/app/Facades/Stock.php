<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use Core\Models\Stock as StockModel;
use Core\Models\Produto\ProductStock;

/**
 * StockProvider
 * @package Core\Facades;
 */
class StockProvider
{
    /**
     * Get stock quantity
     * @param  int $sku
     * @param  string $stock
     * @return int
     */
    public function get($sku, $stock = 'default')
    {
        return ProductStock::where('product_sku', $sku)
            ->where('stock_slug', $stock)
            ->pluck('quantity');
    }

    /**
     * Set stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $stock
     */
    public function set($sku, $quantity, $stock = 'default')
    {
        return ProductStock::updateOrCreate([
            'product_sku' => $sku,
            'stock_slug'  => $stock
        ], [
            'quantity' => $quantity
        ]);
    }

    /**
     * Add stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $stock
     */
    public function add($sku, $quantity, $stock = 'default')
    {
        \Log::notice("Adicionando {$quantity} quantidade no estoque '{$stock}' do produto {$sku}");

        return ProductStock::where('product_sku', $sku)
            ->where('stock_slug', $stock)
            ->increment('quantity', $quantity);
    }

    /**
     * Substract stock quantity
     *
     * @param int $sku
     * @param int $quantity
     * @param string $stock
     */
    public function substract($sku, $quantity, $stock = 'default')
    {
        \Log::notice("Subtraindo {$quantity} quantidade no estoque '{$stock}' do produto {$sku}");

        return ProductStock::where('product_sku', $sku)
            ->where('stock_slug', $stock)
            ->decrement('quantity', $quantity);
    }

    /**
     * Choose stock by priority
     *
     * @param  int|string $sku
     * @return string|null
     */
    public function choose($sku)
    {
        $default = $this->get($sku);

        if (isset($default[0]) && $default[0] > 0) {
            return 'default';
        } else {
            $productStocks = ProductStock
                ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
                ->where('product_sku', '=', $sku)
                ->where('stocks.include', '=', true)
                ->orderBy('stocks.priority', 'ASC')
                ->get();

            foreach ($productStocks as $productStock) {
                if ((int) $productStock->quantity > 0) {
                    return $productStock->stock_slug;
                }
            }
        }

        return null;
    }
}

/**
 * Facade register
 * @package Core\Facades;
 */
class Stock extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'stockProvider';
    }
}
