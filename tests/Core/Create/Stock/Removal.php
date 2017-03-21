<?php namespace Tests\Core\Create\Stock;

use Tests\CreateUsuario;
use Core\Models\Stock\Removal as RemovalModel;

class Removal
{
    /**
    * Create a Removal register
    *
    * @return Core\Models\Stock\Removal
    */
    public static function create($data = [])
    {
        if (!isset($data['user_id'])) {
            $user = CreateUsuario::create();
            $data['user_id'] = $user->id;
        }

        return factory(RemovalModel::class)->create($data);
    }
}
