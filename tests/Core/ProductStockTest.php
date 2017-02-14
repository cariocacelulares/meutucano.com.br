<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Stock;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\ProductStock;
use Core\Models\Produto\ProductStock as ProductStockModel;
use Core\Models\Produto as ProdutoModel;

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

    /**
     * If stock decrement when order is sent (invoiced)
     * @return void
     */
    public function test__it_should_decrease_stock_quantity_when_order_invoiced()
    {
        $order = Pedido::create([
            'status' => 0
        ]);

        $productSku = $order->produtos[0]->produto_sku;
        $stock      = \Stock::choose($productSku);
        $oldStock   = \Stock::get($productSku, $stock)[0];

        $order->status = 2; // enviado
        $order->save();

        $updatedStock = \Stock::get($productSku, $stock)[0];

        $this->assertEquals($oldStock - 1, $updatedStock);
    }

    /**
     * If stock decrement when sent order is created
     * @return void
     */
    public function test__it_should_decrease_stock_quantity_when_create_sent_order()
    {
        $product = Produto::create([
            'estoque' => 10
        ]);

        $oldStock = $product->estoque;

        Pedido::create([
            'status' => 2
        ], $product->sku);

        $product = $product->fresh();

        $this->assertEquals($oldStock - 1, $product->estoque);
    }

    /**
     * If stock decrement when delivered order is created
     * @return void
     */
    public function test__it_should_decrease_stock_quantity_when_create_delivered_order()
    {
        $product = Produto::create([
            'estoque' => 10
        ]);

        $oldStock = $product->estoque;

        Pedido::create([
            'status' => 3
        ], $product->sku);

        $product = $product->fresh();

        $this->assertEquals($oldStock - 1, $product->estoque);
    }

    public function test__it_should_show_stock_minus_pending_and_payed_orders()
    {
    }

    public function test__it_should_increase_stock_when_order_canceled()
    {
    }

    public function test__it_should_increase_stock_when_entry_with_serial()
    {
    }

    public function test__it_should_increase_stock_when_entry_without_serial()
    {
    }
}
