<?php namespace Tests\Core;

use Tests\CreateUsuario;
use Core\Models\Pedido\Nota;

trait CreateNota
{

  use CreatePedido,
    CreateUsuario;

  /**
   * Create one invoice and create invoice test file
   *
   * @return Core\Models\Pedido\Nota
   */
  public function createInvoice($data = [])
  {
    \File::copy(
      storage_path('tests/nota/testNota.xml'),
      storage_path('app/public/nota/testNota.xml')
    );

    return factory(Nota::class)->create(array_merge($data, [
      'pedido_id'  => $this->createOrder()->id,
      'usuario_id' => $this->createUsuario()->id,
      'arquivo'    => 'testNota.xml'
    ]));
  }

  /**
   * Delete file from test invoice
   *
   * @return boolean
   */
  public function resetInvoice()
  {
    return \File::delete(storage_path('app/public/nota/testNota.xml'));
  }
}