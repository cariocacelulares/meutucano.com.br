<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\FaturamentoCodigo;

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
        FaturamentoCodigo::generate();

        $this->json('GET', '/api/codigos/gerar/' . rand(0, 1))
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'codigo'
                ]
            ]);
    }
}
