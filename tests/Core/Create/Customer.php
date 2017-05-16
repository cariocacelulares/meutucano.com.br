<?php namespace Tests\Core\Create;

use Core\Models\Customer as CustomerModel;

class Customer
{
    /**
    * @return Core\Models\Customer
    */
    public static function create($data = [])
    {
        return factory(CustomerModel::class)->create($data);
    }
}
