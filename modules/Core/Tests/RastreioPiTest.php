<?php namespace Modules\Core\Tests;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Core\Models\Pedido\Rastreio\Pi;

class RastreioPiTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreateRastreio;

  /**
   * Testa se é possível exibir a pi a partir do rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_show_the_pi_from_rastreio()
  {
    $rastreio = $this->createRastreio();

    factory(Pi::class)->create([
      'rastreio_id' => $rastreio->id
    ]);

    $response = $this->json('GET', "/api/pis/{$rastreio->id}")
      ->seeJsonStructure(['data'])
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível listar as pis pendentes
   *
   * @return void
   */
  public function test__it_should_be_able_to_list_pending_pis()
  {
    factory(Pi::class)->create([
      'acao'        => null,
      'rastreio_id' => $this->createRastreio()->id
    ]);

    $this->json('GET', "/api/pis/pending")
      ->seeJsonStructure(['data' => []])
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível criar uma pi
   *
   * @return void
   */
  public function test__it_should_be_able_to_create_pi()
  {
    $rastreio = $this->createRastreio();

    $this->json('POST', "/api/pis", [
      'rastreio_id' => $rastreio->id,
    ])->seeStatusCode(201);

    $this->seeInDatabase('pedido_rastreio_pis', [
      'rastreio_id' => $rastreio->id,
    ]);
  }

  /**
   * Testa se o status do rastreio fica devolvido quando a pi é criada com valor pago
   *
   * @return void
   */
  public function test__it_should_change_rastreio_status_when_pi_is_created_with_valor_pago()
  {
    $rastreio = $this->createRastreio();

    $this->json('POST', "/api/pis", [
      'valor_pago'  => 10,
      'rastreio_id' => $rastreio->id,
    ]);

    $rastreio = $rastreio->fresh();

    $this->assertEquals(8, $rastreio->status);
  }

  /**
   * Testa se o status do rastreio fica devolvido quando a pi é criada sem valor pago
   *
   * @return void
   */
  public function test__it_should_change_rastreio_status_when_pi_is_created_without_valor_pago()
  {
    $rastreio = $this->createRastreio();

    $this->json('POST', "/api/pis", [
      'rastreio_id' => $rastreio->id,
    ]);

    $rastreio = $rastreio->fresh();

    $this->assertEquals(7, $rastreio->status);
  }

  /**
   * Testa se o protocolo está sendo adicionado ao pedido quando feito pi
   *
   * @return void
   */
  public function test__it_should_add_protocolo_to_pedido_when_pi_is_create()
  {
    $pedido = $this->createPedido();

    $rastreio = $this->createRastreio([
      'pedido_id' => $pedido->id
    ]);

    $this->json('POST', "/api/pis", [
      'acao'        => 1,
      'rastreio_id' => $rastreio->id,
      'protocolo'   => '123456',
    ]);

    $pedido = $pedido->fresh();

    $this->assertEquals('123456', $pedido->protocolo);
  }
}
