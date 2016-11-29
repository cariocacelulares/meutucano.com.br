<?php namespace Modules\Rastreio\Tests;

use Modules\Rastreio\Models\Rastreio;
use Modules\Core\Tests\CreatePedido;

trait CreateRastreio
{
  use CreatePedido;

  /**
   * Cria um objeto de rastreio
   *
   * @return Modules\Core\Models\Pedido\Rastreio
   */
  public function createRastreio($data = [])
  {
    return factory(Rastreio::class)->create(array_merge([
      'pedido_id' => $this->createPedido()->id,
      'rastreio'  => env('TEST_RASTREIO'),
      'servico'   => (substr(env('TEST_RASTREIO'), 0, 1) == 'P') ? 'pac' : 'sedex'
    ], $data));
  }
}