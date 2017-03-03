<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Defect;
use Tests\Core\Create\ProductImei;

class DefectTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create stock issue via api
     * @return void
     */
    public function test__it_should_be_able_to_create_defect()
    {
        $productImei = ProductImei::create();

        $data = [
            'imei'        => $productImei->imei,
            'description' => 'Tela quebrada'
        ];

        $this->json('POST', '/api/produto/defeito', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'product_sku',
                    'product_imei_id',
                    'description',
                ]
            ]);
    }

    /**
     * Test if stock decrease when issue is created, by deleting product imei
     */
    /*public function test__it_should_be_subtract_stock_when_create_defect()
    {
        $productImei = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        Issue::create([
            'product_imei_id' => $productImei->id
        ]);

        $productStock = $productStock->fresh();

        $this->assertEquals(($oldStock - 1), $productStock->quantity);
    }*/
}
