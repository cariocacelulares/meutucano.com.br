<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\CreateUsuario;
use Tests\Core\Create\Issue;
use Tests\Core\Create\ProductImei;

class StockRemovalTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create stock issue via api
     * @return void
     */
    public function test__it_should_be_able_to_create_stock_issue()
    {
        $user        = CreateUsuario::create();
        $productImei = ProductImei::create();

        $data = [
            'user_id'     => $user->id,
            'imei'        => $productImei->imei,
            'reason'      => 'Outro',
            'description' => 'Caiu da janela'
        ];

        $this->json('POST', '/api/estoque/baixa', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'product_imei_id',
                    'reason',
                    'description',
                ]
            ]);
    }

    /**
     * Test if stock decrease when issue is created, by deleting product imei
     */
    public function test__it_should_be_subtract_stock_when_create_stock_issue()
    {
        $productImei = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        Issue::create([
            'product_imei_id' => $productImei->id
        ]);

        $productStock = $productStock->fresh();

        $this->assertEquals(($oldStock - 1), $productStock->quantity);
    }
}
