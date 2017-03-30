<?php namespace Tests\Core\Create\Stock;

use Tests\CreateUsuario;
use Tests\Core\Create\Product\ProductImei;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\ProductImei as ProductImeiModel;
use Core\Models\Stock\RemovalProduct as RemovalProductModel;

class RemovalProduct
{
    use RevisionableTrait;

    /**
    * Create a RemovalProduct register
    *
    * @return Core\Models\Stock\RemovalProduct
    */
    public static function create($data = [])
    {
        $productImei = null;
        if (!isset($data['product_imei_id'])) {
            $productImei = ProductImei::create();
            $data['product_imei_id'] = $productImei->id;
        }

        if (!isset($data['product_stock_id'])) {
            if (!$productImei) {
                $productImei = ProductImeiModel::find($data['product_imei_id']);
            }

            $data['product_stock_id'] = $productImei->product_stock_id;
        }

        if (!isset($data['stock_removal_id'])) {
            $data['stock_removal_id'] = Removal::create()->id;
        }

        return factory(RemovalProductModel::class)->create($data);
    }
}
