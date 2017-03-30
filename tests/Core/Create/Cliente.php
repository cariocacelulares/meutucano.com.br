<?php namespace Tests\Core\Create;

use Core\Models\Cliente as ClienteModel;

class Cliente
{
    /**
    * Cria um objeto de cliente
    *
    * @return Core\Models\Cliente
    */
    public static function create($data = [])
    {
        return factory(ClienteModel::class)->create($data);
    }
}
