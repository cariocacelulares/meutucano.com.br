<?php namespace Tests\Core;

use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\Imposto;
use Core\Models\Produto\Produto;
use Core\Models\Usuario\Usuario;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Models\Pedido\PedidoProduto;

trait CreatePedido
{
  use CreateProduto;

  /**
   * Create one order
   *
   * @return Core\Models\Pedido\Pedido
   */
  public function createOrder($data = [], $productSku = null)
  {
    $cliente = factory(Cliente::class)->create();
    $endereco = factory(Endereco::class)->create([
      'cliente_id' => $cliente->id
    ]);

    $pedido = factory(Pedido::class)->create(array_merge($data, [
      'cliente_id'          => $cliente->id,
      'cliente_endereco_id' => $endereco->id
    ]));

    factory(PedidoProduto::class)->create([
      'pedido_id'   => $pedido->id,
      'produto_sku' => ($productSku)
        ? Produto::find($productSku)->sku
        : $this->createProduto()->sku
    ]);

    return $pedido;
  }
}
