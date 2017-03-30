<?php namespace Tests\Core\Create;

use Tests\CreateUsuario;
use Core\Models\Supplier as SupplierModel;

class Supplier
{
    /**
    * Create a Supplier register
    *
    * @return Core\Models\Supplier
    */
    public static function create($data = [])
    {
        return factory(SupplierModel::class)->create($data);
    }
}
