<?php namespace Tests\Core;

use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\Imposto;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto\Produto;
use Core\Models\Produto\ProductStock;
use Core\Models\Usuario\Usuario;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Tests\Core\CreateFaturamentoCodigo;

class CreatePedido
{
    /**
    * Create one order
    *
    * @return Core\Models\Pedido\Pedido
    */
    public static function create($data = [], $productSku = null)
    {
        CreateFaturamentoCodigo::generate();

        $cliente  = factory(Cliente ::class)->create();
        $endereco = factory(Endereco::class)->create([
            'cliente_id' => $cliente->id
        ]);

        $pedido = factory(Pedido::class)->create(array_merge($data, [
            'cliente_id'          => $cliente->id,
            'cliente_endereco_id' => $endereco->id
        ]));

        $produto = ($productSku) ? Produto::find($productSku) : CreateProduto::create();
        $productStock = ProductStock::where('product_sku', '=', $produto->sku)->first();

        factory(PedidoProduto::class)->create([
            'pedido_id'        => $pedido->id,
            'produto_sku'      => $produto->sku,
            'product_stock_id' => $productStock->id,
        ]);

        return $pedido;
    }
}
