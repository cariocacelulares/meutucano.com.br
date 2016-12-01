<?php namespace Tests\Rastreio;

use Rastreio\Models\Rastreio;
use Tests\Core\CreatePedido;

trait CreateRastreio
{
  use CreatePedido;

  /**
   * Cria um objeto de rastreio
   *
   * @return Rastreio\Models
   */
  public function createRastreio($data = [])
  {
    return factory(Rastreio::class)->create(array_merge([
      'pedido_id' => $this->createOrder()->id,
      'rastreio'  => 'DN677968684BR',
      'servico'   => 'sedex'
    ], $data));
  }
}