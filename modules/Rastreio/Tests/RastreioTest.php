<?php namespace Modules\Rastreio\Tests;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use MailThief\Testing\InteractsWithMail;
use Modules\Rastreio\Http\Controllers\RastreioController;

class RastreioTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    InteractsWithMail,
    CreateRastreio;

  /**
   * Testa se é possível atualizar o status do rastreio pelos correios
   *
   * @return void
   */
  public function test__it_should_be_able_to_refresh_status()
  {
    $rastreio = $this->createRastreio();

    $this->json('PUT', "/api/rastreios/refresh_status/{$rastreio->id}")
      ->seeStatusCode(200);

    $rastreio = $rastreio->fresh();

    $this->assertEquals(4, $rastreio->status);
  }

  /**
   * Testa se gera uma imagem do rastreio ao chegar em um status final
   * @return void
   */
  public function test__it_should_be_able_to_generate_screenshot()
  {
    $rastreio = $this->createRastreio();

    $this->json('PUT', "/api/rastreios/refresh_status/{$rastreio->id}")
      ->seeStatusCode(200);

    $rastreio = $rastreio->fresh();

    $this->json('GET', "/api/rastreios/historico/{$rastreio->id}")
      ->seeStatusCode(200);

    $this->assertFileExists(storage_path('app/public/rastreio/') . env('TEST_RASTREIO') . '.jpg');
  }

  /**
   * Testa se é possível calcular o prazo de um rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_calculate_deadline()
  {
    $rastreio = $this->createRastreio();

    $deadline = RastreioController::deadline($rastreio->rastreio, '89160216');

    $this->assertGreaterThanOrEqual(1, $deadline);
  }
}
