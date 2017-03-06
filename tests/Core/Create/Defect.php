<?php namespace Tests\Core\Create;

use Core\Models\Produto\Defect as DefectModel;
use Core\Models\Produto\ProductImei as ProductImeiModel;

class Defect
{
    /**
    * Create a Defect register
    *
    * @return Core\Models\Produto\Defect
    */
    public static function create($data = [])
    {
        if (!isset($data['product_imei_id'])) {
            $productImei = ProductImei::create();
            $data['product_imei_id'] = $productImei->id;

            $data['product_sku'] = $productImei->productStock->product_sku;
        } else if (!isset($data['product_sku'])) {
            $productImei = ProductImeiModel::find($data['product_imei_id']);
            $data['product_sku'] = $productImei->productStock->product_sku;
        }

        return factory(DefectModel::class)->create($data);
    }
}
