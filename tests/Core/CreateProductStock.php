<?php namespace Tests\Core;

use Core\Models\Produto\ProductStock;

class CreateProductStock
{
    /**
    * Create a ProductStock register
    * @param  array $data
    * @return Core\Models\Produto\ProductStock
    */
    public static function create($data = [])
    {
        if (!isset($data['stock_slug'])) {
            $data['stock_slug'] = CreateStock::create()->slug;
        }

        if (!isset($data['product_sku'])) {
            $data['product_sku'] = CreateProduto::create()->sku;
        }

        return factory(ProductStock::class)->create($data);
    }

    /**
     * Creates a ProductStock with serial enabled
     * @param  array $data
     * @return Core\Models\Produto\ProductStock
     */
    public static function createWithSerial($data = [])
    {
        return CreateProductStock::create(array_merge(
            $data,
            [
                'serial_enabled' => true
            ]
        ));
    }

    /**
     * Creates a ProductStock without serial enabled
     * @param  array $data
     * @return Core\Models\Produto\ProductStock
     */
    public static function createWithoutSerial($data = [])
    {
        return CreateProductStock::create(array_merge(
            $data,
            [
                'serial_enabled' => false
            ]
        ));
    }
}
