<?php namespace Tests\Core\Create\Stock\Entry;

use Tests\Core\Create\Stock\Entry;
use Core\Models\Stock\Entry\Imei as EntryImeiModel;

class Imei
{
    /**
    * Create a Imei register
    *
    * @return Core\Models\Stock\Entry\Imei
    */
    public static function create($productId, $imeiId, $data = [])
    {
        return factory(EntryImeiModel::class)->create(array_merge($data, [
            'stock_entry_product_id' => $productId,
            'product_imei_id'        => $imeiId,
        ]));
    }
}
