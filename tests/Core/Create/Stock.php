<?php namespace Tests\Core\Create;

use Core\Models\Stock as StockModel;

class Stock
{
    /**
    * Create a Stock register
    *
    * @return Core\Models\Stock
    */
    public static function create($data = [])
    {
        return factory(StockModel::class)->create($data);
    }
}
