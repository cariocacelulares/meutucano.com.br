<?php namespace Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Pedido\Rastreio\Monitorado;

class RastreioMonitoradoTest extends TestCase
{
  use DatabaseMigrations,
    DatabaseTransactions,
    CreateRastreio,
    CreateUsuario;

  /**
   * Testa se é possível listar os rastreios monitorados
   *
   * @return void
   */
  public function test__it_should_be_able_to_list_rastreios_monitorados()
  {
    $usuario = $this->createUsuario();

    Monitorado::create([
      'rastreio_id' => $this->createRastreio()->id,
      'usuario_id'  => $usuario->id
    ]);

    $response = $this->actingAs($usuario)
      ->json('GET', '/api/rastreio/monitorados/list')
      ->seeJsonContains(['total' => 1])
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível gerar a lista para o painel
   *
   * @return void
   */
  public function test__it_should_be_able_to_generate_simple_list()
  {
    $usuario = $this->createUsuario();

    // Monitorado::create([
    //   'rastreio_id' => $this->createRastreio()->id,
    //   'usuario_id'  => $usuario->id
    // ]);

    // $response = $this->actingAs($usuario)
    //   ->json('GET', '/api/rastreio/monitorados/simple-list')
    //   ->seeJsonContains(['total' => 1])
    //   ->seeStatusCode(200);
  }
}
