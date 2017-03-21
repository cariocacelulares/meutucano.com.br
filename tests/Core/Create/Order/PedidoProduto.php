<?php namespace Tests\Core\Create\Order;

use Core\Models\Pedido\PedidoProduto as PedidoProdutoModel;
use Core\Models\Produto\ProductStock as ProductStockModel;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Product\ProductImei;
use Tests\Core\Create\Product\ProductStock;

class PedidoProduto
{
    /**
    * Create one order
    *
    * @return Core\Models\Pedido\PedidoProduto
    */
    public static function create($data = [])
    {
        if (!isset($data['pedido_id'])) {
            $data['pedido_id'] = Pedido::create()->id;
        }

        if (!isset($data['produto_sku'])) {
            $data['produto_sku'] = Produto::create()->sku;
        }

        if (!isset($data['product_imei_id'])) {
            $data['product_imei_id'] = ProductImei::create()->id;
        }

        if (!isset($data['product_stock_id'])) {
            $productStock = ProductStockModel
                ::where('product_sku', '=', $data['produto_sku'])
                ->first();

            if (!$productStock) {
                $productStock = ProductStock::create([
                    'product_sku' => $data['produto_sku'],
                ]);
            }

            $data['product_stock_id'] = $productStock->id;
        }


        return factory(PedidoProdutoModel::class)->create($data);
    }
}
