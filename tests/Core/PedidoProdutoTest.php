<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Produto;
use Tests\Core\Create\ProductImei;
use Tests\Core\Create\ProductStock;
use Tests\Core\Create\PedidoProduto;

class PedidoProdutoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    public function setUp()
    {
        parent::setUp();

        $this->produto = Produto::create([
            'estoque' => 10
        ]);
    }

    /**
     * If can create pedido produto via api
     * @return void
     */
    public function test__it_should_be_able_to_create_order_product()
    {
        $data = [
            'pedido_id'        => Pedido::create()->id,
            'produto_sku'      => Produto::create()->sku,
            'product_imei_id'  => ProductImei::create()->id,
            'product_stock_id' => ProductStock::create()->id,
            'valor'            => 99.90,
        ];

        $this->json('POST', '/api/pedido-produtos', $data)
            ->seeStatusCode(201);

        $this->seeInDatabase('pedido_produtos', $data);
    }

    /**
     * If can update pedido produto via api
     * @return void
     */
    public function test__it_should_be_able_to_update_order_product()
    {
        $orderProduct = PedidoProduto::create();

        $data = [
            'pedido_id'        => Pedido::create()->id,
            'produto_sku'      => Produto::create()->sku,
            'product_imei_id'  => ProductImei::create()->id,
            'product_stock_id' => ProductStock::create()->id,
            'valor' => 2.50,
        ];

        $this->json('PUT', "/api/pedido-produtos/{$orderProduct->id}", $data)
            ->seeStatusCode(200);

        $this->seeInDatabase('pedido_produtos', $data);
    }

    /**
    * Testa se abaixa o estoque quando recebe um pedido novo
    *
    * @return void
    */
    public function test__it_should_substract_stock_when_order_created()
    {
        /*CreatePedido::create(['status' => 0], $this->produto->sku); // Pendente
        CreatePedido::create(['status' => 1], $this->produto->sku); // Pago
        CreatePedido::create(['status' => 2], $this->produto->sku); // Enviado
        CreatePedido::create(['status' => 3], $this->produto->sku); // Entregue

        $this->produto = $this->produto->fresh();

        $this->assertEquals(6, $this->produto->estoque);*/
    }

    /**
    * Testa se um pedido novo cancelado não abaixa o estoque
    *
    * @return void
    */
    public function test__it_should_not_substract_stock_when_order_created_is_canceled()
    {
        /*CreatePedido::create(['status' => 5], $this->produto->sku);

        $this->produto = $this->produto->fresh();

        $this->assertEquals(10, $this->produto->estoque);*/
    }

    /**
    * Testa se aumenta o estoque quando um pedido passa para cancelado
    *
    * @return void
    */
    public function test__it_should_sum_stock_when_order_canceled()
    {
        /*$produto = CreateProduto::create([
            'estoque' => 10
        ]);

        $pedido = CreatePedido::create([], $produto->sku);

        $pedido->status = 5;
        $pedido->save();

        $produto = $produto->fresh();
        $this->assertEquals(10, $produto->estoque);*/
    }
}
