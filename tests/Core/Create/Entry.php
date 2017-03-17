<?php namespace Tests\Core\Create;

use Tests\CreateUsuario;
use Tests\Core\Create\Entry\Invoice;
use Tests\Core\Create\Entry\Product;
use Core\Models\Stock\Entry as EntryModel;

class Entry
{
    /**
    * Create a Entry register
    *
    * @return Core\Models\Stock\Entry
    */
    public static function create($data = [], $products = 0, $withInvoice = false)
    {
        if (!isset($data['user_id'])) {
            $data['user_id'] = CreateUsuario::create()->id;
        }

        if (!isset($data['supplier_id'])) {
            $data['supplier_id'] = Supplier::create()->id;
        }

        $entry = factory(EntryModel::class)->create($data);

        if ($withInvoice) {
            Invoice::create([
                'stock_entry_id' => $entry->id,
            ]);
        }

        for ($i=0; $i < $products; $i++) {
            Product::create([
                'stock_entry_id' => $entry->id,
            ]);
        }

        // fresh model with eager loading
        $entry = EntryModel
            ::with(['user', 'supplier', 'invoice', 'products'])
            ->find($entry->id);

        return $entry;
    }
}
