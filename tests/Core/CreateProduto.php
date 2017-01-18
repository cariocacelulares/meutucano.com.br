<?php namespace Tests\Core;

use Core\Models\Produto\Produto;
use Core\Models\Produto\ProductStock;

class CreateProduto
{
    /**
    * Cria um objeto de produto
    *
    * @return Core\Models\Produto\Produto
    */
    public static function create($data = [])
    {
        $stock = isset($data['estoque']) ? $data['estoque'] : null;
        unset($data['estoque']);

        $product = factory(Produto::class)->create($data);

        $productStock = ProductStock::where('product_sku', '=', $product->sku)->first();
        if ($productStock && $stock) {
            $productStock->quantity = $stock;
            $productStock->save();
        } else if (!$productStock) {
            CreateProductStock::create(array_merge([
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
    * @return Core\Models\Produto\Produto
    */
    public static function createSeminovo($data = [])
    {
        return CreateProduto::create(array_merge($data, [
            'estado' => 1
        ]));
    }
}
