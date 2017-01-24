<?php namespace Tests\Core\Create;

use Core\Models\Pedido as PedidoModel;
use Core\Models\Pedido\PedidoProduto as PedidoProdutoModel;
use Core\Models\Produto as ProdutoModel;
use Core\Models\Produto\ProductStock as ProductStockModel;
use Core\Models\Cliente as ClienteModel;
use Core\Models\Cliente\Endereco as EnderecoModel;

class Pedido
{
    /**
    * Create one order
    *
    * @return Core\Models\Pedido
    */
    public static function create($data = [], $productSku = null)
    {
        FaturamentoCodigo::generate();

        $cliente  = factory(ClienteModel::class)->create();
        $endereco = factory(EnderecoModel::class)->create([
            'cliente_id' => $cliente->id
        ]);

        $pedido = factory(PedidoModel::class)->create(array_merge($data, [
            'cliente_id'          => $cliente->id,
            'cliente_endereco_id' => $endereco->id
        ]));

        $produto = ($productSku) ? ProdutoModel::find($productSku) : Produto::create();
        $productStock = ProductStockModel::where('product_sku', '=', $produto->sku)->first();

        factory(PedidoProdutoModel::class)->create([
            'pedido_id'        => $pedido->id,
            'produto_sku'      => $produto->sku,
            'product_stock_id' => $productStock->id,
        ]);

        return $pedido;
    }
}
