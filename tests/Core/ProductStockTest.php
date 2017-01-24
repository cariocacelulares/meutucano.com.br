<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Stock;
use Tests\Core\Create\Produto;
use Tests\Core\Create\ProductStock;

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
        $data = [
            'stock_slug'     => Stock::create()->slug,
            'product_sku'    => Produto::create()->sku,
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
        $productStock = ProductStock::createWithoutSerial();

        $data = [
            'stock_slug'  => Stock::create()->slug,
            'product_sku' => Produto::create()->sku,
            'quantity'    => ($productStock->quantity + 2),
        ];

        $this->json('PUT', "/api/product-stocks/{$productStock->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('product_stocks', array_merge($data, [
            'id'             => $productStock->id,
            'serial_enabled' => $productStock->serial_enabled,
        ]));
    }

    /**
     * If block update quantity of a product stock with serial enabled
     * @return void
     */
    public function test__it_should_be_block_to_update_product_stock_quantity_with_serial_enabled()
    {
        $productStock = ProductStock::createWithSerial();

        $data = [
            'stock_slug'  => Stock::create()->slug,
            'product_sku' => Produto::create()->sku,
            'quantity'    => ($productStock->quantity + 2),
        ];

        $this->json('PUT', "/api/product-stocks/{$productStock->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('product_stocks', array_merge($data, [
            'id'             => $productStock->id,
            'serial_enabled' => true,
            'quantity'       => $productStock->quantity,
        ]));
    }
}
