<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Cliente;
use Tests\Core\Create\Endereco;

class EnderecoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create address via api
     * @return void
     */
    public function test__it_should_be_able_to_create_address()
    {
        $data = [
            'cliente_id'  => Cliente::create()->id,
            'cep'         => '89160000',
            'rua'         => 'oscar barcelos',
            'numero'      => '456',
            'complemento' => 'em frente a asil',
            'bairro'      => 'Centro',
            'cidade'      => 'Rio do Sul',
            'uf'          => 'SC',
        ];

        $this->json('POST', '/api/enderecos', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'cliente_id',
                    'cep',
                    'rua',
                    'numero',
                    'complemento',
                    'bairro',
                    'cidade',
                    'uf',
                ]
            ]);

        $this->seeInDatabase('cliente_enderecos', $data);
    }

    /**
     * If can update address via api
     * @return void
     */
    public function test__it_should_be_able_to_update_address()
    {
        $address = Endereco::create();

        $data = [
            'cliente_id'  => Cliente::create()->id,
            'cep'         => '89160000',
            'rua'         => 'oscar barcelos',
            'numero'      => '456',
            'complemento' => 'em frente a asil',
            'bairro'      => 'Centro',
            'cidade'      => 'Rio do Sul',
            'uf'          => 'SC',
        ];

        $this->json('PUT', "/api/enderecos/{$address->id}", $data)
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'cliente_id',
                    'cep',
                    'rua',
                    'numero',
                    'complemento',
                    'bairro',
                    'cidade',
                    'uf',
                ]
            ]);

        $this->seeInDatabase('cliente_enderecos', array_merge($data, [
            'id' => $address->id
        ]));
    }
}
