<?php namespace Tests\Core;

use Tests\TestCase;
use Tests\Core\Create\Customer;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class CustomerTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * @return void
     */
    public function test__it_should_be_able_to_create_customer()
    {
        $data = [
            'taxvat'    => '10075395171',
            'type'      => 0,
            'name'      => 'Meu Tucano',
            'phone'     => '4735213280',
            'email'     => 'contato@cariocacelulares.com.br',
        ];

        $this->json('POST', '/api/customers', $data)
            ->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'taxvat',
                    'type',
                    'name',
                    'phone',
                    'email',
                ]
            ]);

        $this->assertDatabaseHas('customers', $data);
    }

    /**
     * @return void
     */
    public function test__it_should_be_able_to_update_customer()
    {
        $customer = Customer::create();

        $data = [
            'taxvat'    => '10075395171',
            'type'      => 0,
            'name'      => 'Meu Tucano',
            'phone'     => '4735213280',
            'email'     => 'contato@cariocacelulares.com.br',
        ];

        $this->json('PUT', "/api/customers/{$customer->id}", $data)
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'taxvat',
                    'type',
                    'name',
                    'phone',
                    'email',
                ]
            ]);

        $this->assertDatabaseHas('customers', array_merge($data, [
            'id' => $customer->id
        ]));
    }
}
