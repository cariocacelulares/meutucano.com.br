<?php namespace Modules\Core\Tests;

use Modules\Core\Models\Pedido\Pedido;
use Modules\Core\Models\Pedido\Nota;
use Modules\Core\Models\Pedido\PedidoProduto;
use Modules\Core\Models\Produto\Produto;
use Modules\Core\Models\Pedido\Imposto;
use Modules\Core\Models\Usuario\Usuario;
use Modules\Core\Models\Cliente\Cliente;
use Modules\Core\Models\Cliente\Endereco;

trait CreatePedido
{
  use CreateProduto;

  /**
   * Create one order
   *
   * @return Modules\Core\Models\Pedido\Pedido
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