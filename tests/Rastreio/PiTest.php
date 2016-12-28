<?php namespace Tests\Rastreio;

use Tests\TestCase;
use Rastreio\Models\Pi;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PiTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseTransactions,
    CreateRastreio;

  private $rastreio;

  public function setUp()
  {
    parent::setUp();

    if (!$this->rastreio)
      $this->rastreio = $this->createRastreio();
  }

  /**
   * Testa se é possível exibir a pi a partir do rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_show_the_pi_from_rastreio()
  {
    $pi = factory(Pi::class)->create([
      'rastreio_id' => $this->rastreio->id
    ]);

    $response = $this->json('GET', "/api/pis/{$this->rastreio->id}")
      ->seeJsonStructure(['data'])
      ->seeStatusCode(200);

    $pi->delete();
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
      'rastreio_id' => $this->rastreio->id
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
    $this->json('POST', '/api/pis', [
      'rastreio_id'   => $this->rastreio->id,
      'motivo_status' => 0,
      'codigo_pi'     => '123456',
    ])->seeStatusCode(201);

    $this->seeInDatabase('pedido_rastreio_pis', [
      'rastreio_id' => $this->rastreio->id,
    ]);
  }

  /**
   * Testa se o status do rastreio fica devolvido quando a pi é criada com valor pago
   *
   * @return void
   */
  public function test__it_should_change_rastreio_status_when_pi_is_created_with_valor_pago()
  {
    $this->json('POST', '/api/pis', [
      'valor_pago'    => 10,
      'rastreio_id'   => $this->rastreio->id,
      'motivo_status' => 0,
      'codigo_pi'     => '123456',
    ]);

    $this->rastreio = $this->rastreio->fresh();

    $this->assertEquals(8, $this->rastreio->status);
  }

  /**
   * Testa se o status do rastreio fica devolvido quando a pi é criada sem valor pago
   *
   * @return void
   */
  public function test__it_should_change_rastreio_status_when_pi_is_created_without_valor_pago()
  {
    $this->json('POST', '/api/pis', [
      'rastreio_id'   => $this->rastreio->id,
      'motivo_status' => 0,
      'codigo_pi'     => '123456',
    ]);

    $this->rastreio = $this->rastreio->fresh();

    $this->assertEquals(7, $this->rastreio->status);
  }

  /**
   * Testa se o protocolo está sendo adicionado ao pedido quando feito pi
   *
   * @return void
   */
  public function test__it_should_add_protocolo_to_pedido_when_pi_is_create()
  {
    $pedido = $this->createOrder();

    $this->rastreio = $this->createRastreio([
      'pedido_id' => $pedido->id
    ]);

    $this->json('POST', '/api/pis', [
      'acao'          => 1,
      'rastreio_id'   => $this->rastreio->id,
      'protocolo'     => '123456',
      'motivo_status' => 0,
      'codigo_pi'     => '123456',
    ]);

    $pedido = $pedido->fresh();

    $this->assertEquals('123456', $pedido->protocolo);
  }
}
