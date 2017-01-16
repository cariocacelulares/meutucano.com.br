<?php namespace Tests\Core;

use Tests\CreateUsuario;
use Core\Models\Pedido\Nota;

class CreateNota
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

        return factory(Nota::class)->create(array_merge($data, [
            'pedido_id'  => CreatePedido::create()->id,
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
