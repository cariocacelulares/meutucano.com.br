<?php namespace Modules\Core\Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Modules\Core\Models\Pedido\FaturamentoCodigo;

class FaturamentoCodigoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions;

  /**
   * Testa se é possível gerar código de rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_generate_code()
  {
    factory(FaturamentoCodigo::class)->create([
      'servico' => 0
    ]);

    $response = $this->json('GET', '/api/codigos/gerar/0')->seeJsonStructure([
      'data' => [
        'codigo'
      ]
    ]);

    $this->seeStatusCode(200);
  }

}
