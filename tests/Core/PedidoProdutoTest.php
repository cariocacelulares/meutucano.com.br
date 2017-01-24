<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Produto;

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
