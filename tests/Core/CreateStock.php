<?php namespace Tests\Core;

use Core\Models\Stock;

class CreateStock
{
    /**
    * Create a Stock register
    *
    * @return Core\Models\Stock
    */
    public static function create($data = [])
    {
        return factory(Stock::class)->create($data);
    }
}
