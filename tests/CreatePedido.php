<?php namespace Tests;

use App\Models\Pedido\Pedido;
use App\Models\Pedido\Nota;
use App\Models\Pedido\PedidoProduto;
use App\Models\Produto\Produto;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Imposto;
use App\Models\Usuario\Usuario;
use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;

trait CreatePedido
{
  use CreateProduto;

  /**
   * Cria um objeto de pedido
   *
   * @return App\Models\Pedido\Pedido
   */
  public function createPedido($data = [], $productSku = null)
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