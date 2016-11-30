<?php namespace Modules\Rastreio\Tests;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Rastreio\Models\Devolucao;

class DevolucaoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreateRastreio;

  /**
   * Testa se é possível exibir a devolução a partir do rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_show_the_devolucao_from_rastreio()
  {
    $rastreio = $this->createRastreio();

    factory(Devolucao::class)->create([
      'rastreio_id' => $rastreio->id
    ]);

    $response = $this->json('GET', "/api/devolucoes/{$rastreio->id}")
      ->seeJsonStructure(['data'])
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível listar as devoluções pendentes
   *
   * @return void
   */
  public function test__it_should_be_able_to_list_pending_devolucoes()
  {
    factory(Devolucao::class)->create([
      'acao'        => null,
      'rastreio_id' => $this->createRastreio()->id
    ]);

    $this->json('GET', "/api/devolucoes/pending")
      ->seeJsonStructure(['data' => []])
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível criar uma devolução
   *
   * @return void
   */
  public function test__it_should_be_able_to_create_devolucao()
  {
    $rastreio = $this->createRastreio();

    $this->json('POST', "/api/devolucoes", [
      'motivo'      => 1,
      'rastreio_id' => $rastreio->id,
    ])->seeStatusCode(201);

    $this->seeInDatabase('pedido_rastreio_devolucoes', [
      'motivo'      => 1,
      'rastreio_id' => $rastreio->id,
    ]);
  }

  /**
   * Testa se o status do rastreio fica devolvido quando a devolução é criada
   *
   * @return void
   */
  public function test__it_should_change_rastreio_status_when_devolucao_is_created()
  {
    $rastreio = $this->createRastreio();

    $this->json('POST', "/api/devolucoes", [
      'motivo'      => 1,
      'rastreio_id' => $rastreio->id,
    ]);

    $rastreio = $rastreio->fresh();

    $this->assertEquals(5, $rastreio->status);
  }

  /**
   * Testa se o protocolo está sendo adicionado ao pedido quando devolvido
   *
   * @return void
   */
  public function test__it_should_add_protocolo_to_pedido_when_devolucao_is_create()
  {
    $pedido = $this->createOrder();

    $rastreio = $this->createRastreio([
      'pedido_id' => $pedido->id
    ]);

    $this->json('POST', "/api/devolucoes", [
      'motivo'      => 1,
      'acao'        => 1,
      'rastreio_id' => $rastreio->id,
      'protocolo'   => '123456',
    ]);

    $pedido = $pedido->fresh();

    $this->assertEquals('123456', $pedido->protocolo);
  }
}
