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
        if (!isset($data['stock_id'])) {
            $data['stock_id'] = CreateStock::create()->id;
        }

        if (!isset($data['produto_sku'])) {
            $data['produto_sku'] = CreateProduto::create()->sku;
        }

        return factory(ProductStock::class)->create($data);
    }
}
