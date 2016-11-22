<?php namespace Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PedidoProdutoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreatePedido;

  /**
   * Testa se abaixa o estoque quando recebe um pedido novo
   *
   * @return void
   */
  public function test__it_should_substract_stock_when_order_created()
  {
    $produto = $this->createProduto([
      'estoque' => 10
    ]);

    $this->createPedido(['status' => 0], $produto->sku); // Pendente
    $this->createPedido(['status' => 1], $produto->sku); // Pago
    $this->createPedido(['status' => 2], $produto->sku); // Enviado
    $this->createPedido(['status' => 3], $produto->sku); // Entregue

    $produto = $produto->fresh();

    $this->assertEquals(6, $produto->estoque);
  }

  /**
   * Testa se um pedido novo cancelado não abaixa o estoque
   *
   * @return void
   */
  public function test__it_should_not_substract_stock_when_order_created_is_canceled()
  {
    $produto = $this->createProduto([
      'estoque' => 10
    ]);

    $this->createPedido(['status' => 5], $produto->sku);

    $produto = $produto->fresh();

    $this->assertEquals(10, $produto->estoque);
  }

  /**
   * Testa se aumenta o estoque quando um pedido passa para cancelado
   *
   * @return void
   */
  public function test__it_should_sum_stock_when_order_canceled()
  {
    $produto = $this->createProduto([
      'estoque' => 10
    ]);

    $pedido = $this->createPedido([], $produto->sku);
    $produto = $produto->fresh();

    $this->assertEquals(9, $produto->estoque);

    $pedido->status = 5;
    $pedido->save();

    $produto = $produto->fresh();
    $this->assertEquals(10, $produto->estoque);
  }
}