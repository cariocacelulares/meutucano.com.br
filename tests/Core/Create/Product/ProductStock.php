<?php namespace Tests\Core\Create\Product;

use Core\Models\Produto\ProductStock as ProductStockModel;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Stock;

class ProductStock
{
    /**
    * Create a ProductStock register
    *
    * @param  array $data
    * @return Core\Models\Produto\ProductStock
    */
    public static function create($data = [], $includedStock = false)
    {
        if (!isset($data['stock_slug'])) {
            $data['stock_slug'] = Stock::create(
                $includedStock ? ['include' => true] : []
            )->slug;
        }

        if (!isset($data['product_sku'])) {
            $data['product_sku'] = Produto::create()->sku;
        }

        return factory(ProductStockModel::class)->create($data);
    }

    /**
     * Creates a ProductStock with serial enabled
     *
     * @param  array $data
     * @return Core\Models\Produto\ProductStock
     */
    public static function createWithSerial($data = [])
    {
        return ProductStock::create(array_merge(
            $data,
            [
                'serial_enabled' => true
            ]
        ));
    }

    /**
     * Creates a ProductStock without serial enabled
     *
     * @param  array $data
     * @return Core\Models\Produto\ProductStock
     */
    public static function createWithoutSerial($data = [])
    {
        return ProductStock::create(array_merge(
            $data,
            [
                'serial_enabled' => false
            ]
        ));
    }
}
