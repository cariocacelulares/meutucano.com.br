<?php namespace Modules\Core\Tests;

use Tests\TestCase;
use Modules\Core\Http\Controllers\Pedido\PedidoController;
use Modules\Core\Models\Pedido\Pedido;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PedidoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreatePedido;

  /**
   * Testa se é possível alterar a prioridade do pedido
   *
   * @return void
   */
  public function test__it_should_be_able_to_change_priority()
  {
    $pedido = $this->createOrder();

    $this->json('PUT', "/api/pedidos/prioridade/{$pedido->id}", [
        'priorizado' => 1
    ])->seeStatusCode(200);

    $pedido = $pedido->fresh();
    $this->assertEquals(1, $pedido->priorizado);
  }

  /**
   * Testa se é possível segurar o pedido
   *
   * @return void
   */
  public function test__it_should_be_able_to_hold()
  {
    $pedido = $this->createOrder();

    $this->json('PUT', "/api/pedidos/segurar/{$pedido->id}", [
      'segurar' => 1
    ])->seeStatusCode(200);

    $pedido = $pedido->fresh();
    $this->assertEquals(1, $pedido->segurado);
  }

  /**
   * Testa se é possível cancelar pedidos sem protocolo com protocolo obrigatório
   *
   * @return void
   */
  public function test__it_should_not_be_able_to_cancel_without_protocolo_in_required_marketplaces()
  {
    $pedido = $this->createOrder([
      'marketplace' => 'b2w',
      'status'      => 0
    ]);

    $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
      'status'    => 5
    ])->seeStatusCode(422);
  }

  /**
   * Testa se é possível cancelar pedidos com protocolo obrigatório
   *
   * @return void
   */
  public function test__it_should_be_able_to_cancel_without_protocolo_in_non_required_marketplaces()
  {
    $pedido = $this->createOrder([
      'marketplace' => 'site',
      'status'      => 0
    ]);

    $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
      'status'    => 5
    ])->seeStatusCode(200);

    $pedido = $pedido->fresh();
    $this->assertEquals(5, $pedido->status);
  }

  /**
   * Testa se o pedido é marcado como reembolso quando é cancelado depois de pago
   *
   * @return void
   */
  public function test__it_should_mark_as_reembolso_when_canceled_after_paid()
  {
    $pedido = $this->createOrder([
      'status' => 1
    ]);

    $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
      'status'    => 5,
      'protocolo' => '123456'
    ])->seeStatusCode(200);

    $pedido = $pedido->fresh();
    $this->assertEquals(1, $pedido->reembolso);
  }
}
