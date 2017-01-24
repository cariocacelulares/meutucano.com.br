<?php namespace Tests\Core\Create;

use Core\Models\Produto\ProductImei as ProductImeiModel;

class ProductImei
{
    /**
    * Create a Stock register
    *
    * @return Core\Models\Produto\ProductImei
    */
    public static function create($data = [])
    {
        if (!isset($data['product_stock_id'])) {
            $data['product_stock_id'] = ProductStock::create()->id;
        }

        return factory(ProductImeiModel::class)->create($data);
    }
}
