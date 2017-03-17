<?php namespace Tests\Core\Create\Entry;

use Tests\CreateUsuario;
use Tests\Core\Create\Entry;
use Tests\Core\Create\Produto;
use Tests\Core\Create\ProductStock;
use Core\Models\Stock\Entry\Product as EntryProductModel;

class Product
{
    /**
    * Create a Product register
    *
    * @return Core\Models\Stock\Entry\Product
    */
    public static function create($data = [])
    {
        if (!isset($data['stock_entry_id'])) {
            $data['stock_entry_id'] = Entry::create()->id;
        }

        if (!isset($data['product_sku'])) {
            $data['product_sku'] = Produto::create()->sku;
        }

        if (!isset($data['product_stock_id'])) {
            $data['product_stock_id'] = ProductStock::create([
                'product_sku' => $data['product_sku'],
            ])->id;
        }

        return factory(EntryProductModel::class)->create($data);
    }
}
