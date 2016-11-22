<?php namespace Tests;

use App\Models\Pedido\Nota;

trait CreateNota
{

  use CreatePedido,
    CreateUsuario;

  /**
   * Cria um objeto de pedido
   *
   * @return App\Models\Pedido\Pedido
   */
  public function createNota($data = [])
  {
    \File::copy(
      storage_path('tests/nota/testNota.xml'),
      storage_path('app/public/nota/testNota.xml')
    );

    return factory(Nota::class)->create(array_merge($data, [
      'pedido_id'  => $this->createPedido()->id,
      'usuario_id' => $this->createUsuario()->id,
      'arquivo'    => 'testNota.xml'
    ]));
  }

  /**
   * Deleta o arquivo de teste da nota
   *
   * @return boolean
   */
  public function resetNota()
  {
    return \File::delete(storage_path('app/public/nota/testNota.xml'));
  }
}