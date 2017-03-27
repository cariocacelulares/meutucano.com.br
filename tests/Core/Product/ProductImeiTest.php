<?php namespace Tests\Core\Product;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Product\ProductImei;
use Tests\Core\Create\Product\ProductStock;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Order\PedidoProduto;

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

    /**
     * If productimei will receive a cost when order sent
     */
    public function test__it_will_set_cost_on_sent()
    {
        $cost = 245.73;

        $product = Produto::create([
            'cost' => $cost,
        ]);

        $productImei = ProductImei::create();

        $order = Pedido::create([
            'status' => 1,
        ], $product->sku);

        $orderProduct = PedidoProduto::create([
            'pedido_id'       => $order->id,
            'produto_sku'     => $product->sku,
            'product_imei_id' => $productImei->id,
        ]);

        $order = $order->fresh();
        $order->status = 2;
        $order->save();

        $productImei = $productImei->fresh();

        $this->assertEquals($cost, $productImei->cost);
    }
}
