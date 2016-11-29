<?php namespace Tests;

use App\Models\Pedido\Rastreio;

trait CreateRastreio
{
  use CreatePedido;

  /**
   * Cria um objeto de rastreio
   *
   * @return App\Models\Pedido\Rastreio
   */
  public function createRastreio($data = [])
  {
    return factory(Rastreio::class)->create(array_merge([
      'pedido_id' => $this->createPedido()->id,
      'rastreio'  => 'DN677968684BR',
      'servico'   => 'sedex'
    ], $data));
  }
}