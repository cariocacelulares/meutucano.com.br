<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Cliente;

class ClienteTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create client via api
     * @return void
     */
    public function test__it_should_be_able_to_create_client()
    {
        $data = [
            'taxvat'    => '10075395171',
            'tipo'      => 0,
            'nome'      => 'Meu Tucano',
            'fone'      => '4735213280',
            'email'     => 'contato@cariocacelulares.com.br',
        ];

        $this->json('POST', '/api/clientes', $data)
            ->seeStatusCode(201);

        $this->seeInDatabase('clientes', $data);
    }

    /**
     * If can update client via api
     * @return void
     */
    public function test__it_should_be_able_to_update_client()
    {
        $client = Cliente::create();

        $data = [
            'taxvat'    => '14619408000150',
            'tipo'      => 1,
            'nome'      => 'Carioca Celulares',
            'fone'      => '4788681917',
            'email'     => 'rh@cariocacelulares.com.br',
        ];

        $this->json('PUT', "/api/clientes/{$client->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('clientes', $data);
    }
}
