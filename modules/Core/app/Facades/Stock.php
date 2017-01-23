<?php namespace Core\Facades;

use Core\Models\Produto\ProductStock;
use Illuminate\Support\Facades\Facade;

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
        return ProductStock::where('product_sku', $sku)
            ->where('stock_slug', $stock)
            ->decrement('quantity', $quantity);
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
