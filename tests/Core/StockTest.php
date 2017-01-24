<?php namespace Tests\Core;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

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
        $include  = rand(10, 20);
        $priority = rand(1, 10);

        $this->json('POST', '/api/stocks', [
            'title'    => 'Novo estoque',
            'include'  => $include,
            'priority' => $priority,
        ])->seeStatusCode(201);

        $this->seeInDatabase('stocks', [
            'title' => 'Novo estoque',
            'include'  => $include,
            'priority' => $priority,
        ]);
}

    /**
     * If can update stock via api
     * @return void
     */
    public function test__it_should_be_able_to_update_stock()
    {
        $stock = CreateStock::create();

        $include  = rand(10, 20);
        $priority = rand(1, 10);

        $stock->update([
            'title'    => 'Novo titulo',
            'include'  => $include,
            'priority' => $priority,
        ]);

        $this->seeInDatabase('stocks', [
            'title'    => 'Novo titulo',
            'include'  => $include,
            'priority' => $priority,
        ]);
    }
}
