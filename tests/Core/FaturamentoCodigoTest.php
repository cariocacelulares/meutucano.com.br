<?php namespace Tests\Core;

use Tests\TestCase;
use Core\Models\Pedido\FaturamentoCodigo;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FaturamentoCodigoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseTransactions;

  /**
   * Testa se é possível gerar código de rastreio
   *
   * @return void
   */
  public function test__it_should_be_able_to_generate_code()
  {
    if (!FaturamentoCodigo::where('servico', '=', 0)->first()) {
      factory(FaturamentoCodigo::class)->create([
        'servico' => 0
      ]);
    }

    $response = $this->json('GET', '/api/codigos/gerar/0')->seeJsonStructure([
      'data' => [
        'codigo'
      ]
    ]);

    $this->seeStatusCode(200);
  }

}
