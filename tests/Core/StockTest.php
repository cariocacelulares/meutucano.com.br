<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Stock;

class StockTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create stock via api
     * @return void
     */
    public function test__it_should_be_able_to_create_stock()
    {
        $data = [
            'title'    => 'Novo estoque',
            'include'  => rand(10, 20),
            'priority' => rand(1, 10),
        ];

        $this->json('POST', '/api/stocks', $data)
            ->seeStatusCode(201);

        $this->seeInDatabase('stocks', $data);
}

    /**
     * If can update stock via api
     * @return void
     */
    public function test__it_should_be_able_to_update_stock()
    {
        $stock = Stock::create();

        $data = [
            'title'    => 'Novo titulo',
            'include'  => rand(10, 20),
            'priority' => rand(1, 10),
        ];

        $this->json('PUT', "/api/stocks/{$stock->slug}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('stocks', array_merge($data, [
            'slug' => $stock->slug
        ]));
    }
}
