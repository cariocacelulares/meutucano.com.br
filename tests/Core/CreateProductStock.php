<?php namespace Tests\Core;

use Core\Models\Produto\ProductStock;

class CreateProductStock
{
    /**
    * Create a ProductStock register
    *
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
}
