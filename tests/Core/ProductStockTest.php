<?php namespace Tests\Core;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ProductStockTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create product stock via api
     * @return void
     */
    public function test__it_should_be_able_to_create_product_stock()
    {
        $stockSlug  = CreateStock::create()->slug;
        $productSku = CreateProduto::create()->sku;

        $data = [
            'stock_slug'     => $stockSlug,
            'product_sku'    => $productSku,
            'quantity'       => 10,
            'serial_enabled' => rand(0, 1),
        ];

        $this->json('POST', '/api/product-stocks', $data)
            ->seeStatusCode(201);

        $this->seeInDatabase('product_stocks', $data);
}

    /**
     * If can update product stock without serial enabled via api
     * @return void
     */
    public function test__it_should_be_able_to_update_product_stock_without_serial_enabled()
    {
        $produtStock = CreateProductStock::createWithoutSerial();

        $data = [
            'quantity' => ($produtStock->quantity - 2),
        ];

        $this->json('PUT', "/api/product-stocks/{$produtStock->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('product_stocks', array_merge($data, [
            'id'             => $produtStock->id,
            'stock_slug'     => $produtStock->stock_slug,
            'product_sku'    => $produtStock->product_sku,
            'serial_enabled' => $produtStock->serial_enabled,
        ]));
    }
}
