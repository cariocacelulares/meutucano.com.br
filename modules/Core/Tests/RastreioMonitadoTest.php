<?php namespace Modules\Core\Tests;

use Tests\TestCase;
use Tests\CreateUsuario;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Core\Models\Pedido\Rastreio\Monitorado;

class RastreioMonitoradoTest extends TestCase
{
  use DatabaseMigrations,
    DatabaseTransactions,
    CreateRastreio,
    CreateUsuario;

  private $usuario;

  /**
   * Testa se é possível listar os rastreios monitorados
   *
   * @return void
   */
  public function test__it_should_be_able_to_list_rastreios_monitorados()
  {
  //   $this->usuario = $this->createUsuario();

  //   Monitorado::create([
  //     'rastreio_id' => $this->createRastreio()->id,
  //     'usuario_id'  => $this->usuario->id
  //   ]);

  //   $response = $this->actingAs($this->usuario)
  //     ->json('GET', '/api/rastreio/monitorados/list')
  //     ->seeJsonContains(['total' => 1])
  //     ->seeStatusCode(200);
  }

  /**
   * Testa se é possível gerar a lista para o painel
   *
   * @return void
   */
  // public function test__it_should_be_able_to_generate_simple_list()
  // {
  //   dd($this->usuario);
  //   // $usuario = $this->createUsuario();

  //   Monitorado::create([
  //     'rastreio_id' => $this->createRastreio()->id,
  //     'usuario_id'  => $this->usuario->id
  //   ]);

  //   $response = $this->actingAs($this->usuario)
  //     ->json('GET', '/api/rastreio/monitorados/simple-list')
  //     ->seeJsonContains(['total' => 1])
  //     ->seeStatusCode(200);
  // }
}
