<?php namespace Tests\Core\Create\Stock\Entry;

use Tests\CreateUsuario;
use Tests\Core\Create\Stock\Entry;
use Core\Models\Stock\Entry\Invoice as InvoiceModel;

class Invoice
{
    /**
    * Create a Invoice register
    *
    * @return Core\Models\Stock\Entry\Invoice
    */
    public static function create($data = [])
    {
        if (!isset($data['stock_entry_id'])) {
            $entry = Entry::create();
            $data['stock_entry_id'] = $entry->id;
        }

        return factory(InvoiceModel::class)->create($data);
    }
}
