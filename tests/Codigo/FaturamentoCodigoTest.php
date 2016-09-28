<?php namespace Tests\Codigo;

use App\Models\FaturamentoCodigo;
use Tests\TestCase;

class FaturamentoCodigoTest extends TestCase
{
    /**
     * Test if user can fetch passwords by user id
     */
    public function test__it_should_be_able_to_fetch_code_if_not_expired()
    {
        FaturamentoCodigo::create([
            'servico' => 0,
            'atual'   => 12457000,
            'fim'     => 12457947
        ]);

        $this->json(
            'GET',
            '/api/codigos/gerar/0',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);
    }

    public function test__it_should_receive_advice_if_codes_are_ending()
    {
        FaturamentoCodigo::create([
            'servico' => 0,
            'atual'   => 12457900,
            'fim'     => 12457947
        ]);

        $this->json(
            'GET',
            '/api/codigos/gerar/0',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success',
        ])->seeJsonStructure([
            'data' => ['msg']
        ]);
    }

    public function test__it_should_not_be_able_to_fetch_code_if_expired()
    {
        FaturamentoCodigo::create([
            'servico' => 0,
            'atual'   => 12457947,
            'fim'     => 12457947
        ]);

        $this->json(
            'GET',
            '/api/codigos/gerar/0',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success',
        ])->seeJsonStructure([
            'data' => ['error']
        ]);
    }
}
