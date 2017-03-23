<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\ProductImei;
use Tests\Core\Create\ProductStock;

class ProductImeiTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create product imei via api
     * @return void
     */
    public function test__it_should_be_able_to_create_product_imei()
    {
        $data = [
            'product_stock_id' => ProductStock::create()->id,
            'imei'             => str_random(15),
        ];

        $this->json('POST', '/api/produto-imei', $data)
           ->seeStatusCode(201)
           ->seeJsonStructure([
               'data' => [
                   'id',
                   'imei',
                   'product_stock_id',
               ]
           ]);

        $this->seeInDatabase('product_imeis', $data);
    }

    /**
     * If can update product imei via api
     * @return void
     */
    public function test__it_should_be_able_to_update_product_imei()
    {
        $productImei = ProductImei::create();

        $data = [
            'product_stock_id' => ProductStock::create()->id,
            'imei'             => str_random(15),
        ];

        $this->json('PUT', "/api/produto-imei/{$productImei->id}", $data)
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'imei',
                    'product_stock_id',
                ]
            ]);

        $this->seeInDatabase('product_imeis', array_merge($data, [
            'id' => $productImei->id,
        ]));
    }
}
