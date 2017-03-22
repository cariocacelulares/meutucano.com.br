<?php namespace Tests\Core\Create\Order\Nota;

use Tests\CreateUsuario;
use Tests\Core\Create\Order\Nota;
use Core\Models\Pedido\Nota\Devolucao as DevolucaoModel;

class Devolucao
{
    public static function create($data = [])
    {
        if (!isset($data['nota_id'])) {
            $data['nota_id'] = Nota::create()->id;
        }

        if (!isset($data['usuario_id'])) {
            $data['usuario_id'] = CreateUsuario::create()->id;
        }

        return factory(DevolucaoModel::class)->create($data);
    }
}
