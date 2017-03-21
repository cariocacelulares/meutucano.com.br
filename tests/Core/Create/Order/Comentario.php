<?php namespace Tests\Core\Create\Order;

use Core\Models\Pedido\Comentario as ComentarioModel;
use Tests\CreateUsuario;

class Comentario
{
    /**
    * Create a Comentario register
    *
    * @return Core\Models\Pedido\Comentario
    */
    public static function create($data = [])
    {
        if (!isset($data['pedido_id'])) {
            $data['pedido_id'] = Pedido::create()->id;
        }

        if (!isset($data['usuario_id'])) {
            $data['usuario_id'] = CreateUsuario::create()->id;
        }

        return factory(ComentarioModel::class)->create($data);
    }
}
