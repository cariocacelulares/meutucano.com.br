<?php namespace Tests\Core\Product;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Product\Defect;
use Tests\Core\Create\Product\ProductImei;

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

        $this->seeInDatabase('product_defects', [
            'product_sku'     => $productImei->productStock->product_sku,
            'product_imei_id' => $productImei->id,
            'description'     => $data['description'],
        ]);
    }

    /**
     * Test if stock decrease when defect is created, by deleting product imei
     */
    public function test__it_should_be_subtract_stock_when_create_defect()
    {
        $productImei = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        Defect::create([
            'product_imei_id' => $productImei->id
        ]);

        $productStock = $productStock->fresh();

        $this->assertEquals(($oldStock - 1), $productStock->quantity);
    }

    /**
     * Test if stock increase when defect is deleted, by restoring product imei
     */
    public function test__it_should_be_increase_stock_when_defect_is_deleted()
    {
        $productImei = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        $defect = Defect::create([
            'product_imei_id' => $productImei->id
        ]);

        $defect->delete();

        $productStock = $productStock->fresh();

        $this->assertEquals($oldStock, $productStock->quantity);
    }
}
