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
        $productStockId = ProductStock::create()->id;

        $data = [
            'product_stock_id' => $productStockId,
            'imei'             => str_random(15),
        ];

        $this->json('POST', '/api/product-imeis', $data)
            ->seeStatusCode(201);

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
            'imei' => str_random(15),
        ];

        $this->json('PUT', "/api/product-imeis/{$productImei->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('product_imeis', array_merge($data, [
            'id'               => $productImei->id,
            'product_stock_id' => $productImei->product_stock_id,
        ]));
    }
}
