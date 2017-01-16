<?php namespace Tests\Core;

use Tests\TestCase;
use Core\Models\Pedido\FaturamentoCodigo;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\Core\CreateFaturamentoCodigo;

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
        CreateFaturamentoCodigo::generate();

        $response = $this->json('GET', '/api/codigos/gerar/' . rand(0, 1))->seeJsonStructure([
            'data' => [
                'codigo'
            ]
        ]);

        $this->seeStatusCode(200);
    }
}
