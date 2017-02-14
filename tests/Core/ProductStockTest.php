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

    /**
     * If stock increment when order is canceled
     * @return void
     */
    public function test__it_should_increase_stock_when_order_canceled()
    {
        $order = Pedido::create([
            'status' => 0
        ]);

        $productSku = $order->produtos[0]->produto_sku;
        $stock      = \Stock::choose($productSku);
        $oldStock   = \Stock::get($productSku, $stock)[0];

        $order->status = 5; // cancelado
        $order->save();

        $updatedStock = \Stock::get($productSku, $stock)[0];

        $this->assertEquals($oldStock + 1, $updatedStock);
    }

    /**
     * If stock increment when entry by imei
     * @return void
     */
    public function test__it_should_increase_stock_when_entry_with_serial()
    {
        $product = Produto::create([
            'serial_enabled' => true,
        ]);
        $oldStock = $product->estoque;

        $productStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->orderBy('stocks.priority', 'ASC')
            ->first();

        $imeis = 'DASD21DSD2ED' . PHP_EOL . 'REW432ERWR23';

        $this->json('POST', '/api/product-stocks/entry', [
                'sku'        => $product->sku,
                'stock_slug' => $productStock->stock_slug,
                'imeis'      => $imeis,
                'quantity'   => null,
            ])
            ->seeStatusCode(200);

        $product = $product->fresh();

        $this->assertEquals($oldStock + 2, $product->estoque);
    }

    /**
     * If stock increment when entry by quantity
     * @return void
     */
    public function test__it_should_increase_stock_when_entry_without_serial()
    {
        $product = Produto::create([
            'serial_enabled' => false,
        ]);
        $oldStock = $product->estoque;

        $productStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->orderBy('stocks.priority', 'ASC')
            ->first();

        $this->json('POST', '/api/product-stocks/entry', [
                'sku'        => $product->sku,
                'stock_slug' => $productStock->stock_slug,
                'imeis'      => null,
                'quantity'   => 2,
            ])
            ->seeStatusCode(200);

        $product = $product->fresh();

        $this->assertEquals($oldStock + 2, $product->estoque);
    }

    /**
     * If modify only calculated stock and not the real stock, when a pending order is created
     * @return void
     */
    public function test__it_should_be_modify_only_calculated_stock_when_pending_order()
    {
        $product = Produto::create([
            'estoque' => 10
        ]);
        $product  = $product->fresh();
        $oldStock = $product->estoque;

        Pedido::create([
            'status' => 0
        ], $product->sku);

        $product  = $product->fresh();

        $realStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->sum('quantity');

        $this->assertEquals($realStock, $oldStock);
        $this->assertEquals($oldStock - 1, $product->estoque);
    }

    /**
     * If modify only calculated stock and not the real stock, when a payed order is created
     * @return void
     */
    public function test__it_should_be_modify_only_calculated_stock_when_payed_order()
    {
        $product = Produto::create([
            'estoque' => 10
        ]);
        $product  = $product->fresh();
        $oldStock = $product->estoque;

        Pedido::create([
            'status' => 1
        ], $product->sku);

        $product  = $product->fresh();

        $realStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->sum('quantity');

        $this->assertEquals($realStock, $oldStock);
        $this->assertEquals($oldStock - 1, $product->estoque);
    }

    /**
     * If modify only calculated stock and not the real stock, when a payed order is payed
     * @return void
     */
    public function test__it_should_be_modify_only_calculated_stock_when_pay_order()
    {
        $product = Produto::create([
            'estoque' => 10
        ]);
        $product  = $product->fresh();
        $oldStock = $product->estoque;

        $order = Pedido::create([
            'status' => 0
        ], $product->sku);

        $order->status = 1;
        $order->save();

        $product = $product->fresh();

        $realStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->sum('quantity');

        $this->assertEquals($realStock, $oldStock);
        $this->assertEquals($oldStock - 1, $product->estoque);
    }
}
