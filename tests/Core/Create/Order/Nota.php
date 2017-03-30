<?php namespace Tests\Core\Create\Order;

use Tests\CreateUsuario;
use Tests\Core\Create\Pedido;
use Core\Models\Pedido\Nota as NotaModel;

class Nota
{
    /**
    * Create one invoice and create invoice test file
    *
    * @return Core\Models\Pedido\Nota
    */
    public static function create($data = [])
    {
        \File::copy(
            storage_path('tests/nota/testNota.xml'),
            storage_path('app/public/nota/testNota.xml')
        );

        return factory(NotaModel::class)->create(array_merge($data, [
            'pedido_id'  => Pedido::create()->id,
            'usuario_id' => CreateUsuario::create()->id,
            'arquivo'    => 'testNota.xml'
        ]));
    }

    /**
    * Delete file from test invoice
    *
    * @return boolean
    */
    public static function reset()
    {
        return \File::delete(storage_path('app/public/nota/testNota.xml'));
    }
}
