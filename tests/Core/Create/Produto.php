<?php namespace Tests\Core\Create;

use Core\Models\Produto as ProdutoModel;
use Core\Models\Produto\ProductStock as ProductStockModel;

class Produto
{
    /**
    * Cria um objeto de produto
    *
    * @return Core\Models\Produto
    */
    public static function create($data = [])
    {
        $stock = isset($data['estoque']) ? $data['estoque'] : null;
        unset($data['estoque']);

        $product = factory(ProdutoModel::class)->create($data);

        $productStock = ProductStockModel::where('product_sku', '=', $product->sku)->first();
        if ($productStock && $stock) {
            $productStock->quantity = $stock;
            $productStock->save();
        } else if (!$productStock) {
            ProductStock::create(array_merge([
                'product_sku' => $product->sku,
            ], is_null($stock) ? [] : [
                'quantity'    => $stock
            ]));
        }

        return $product->fresh();
    }

    /**
    * Cria um objeto de produto seminovo
    *
    * @return Core\Models\Produto
    */
    public static function createSeminovo($data = [])
    {
        return Produto::create(array_merge($data, [
            'estado' => 1
        ]));
    }
}
