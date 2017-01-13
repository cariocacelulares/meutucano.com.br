<?php namespace Tests\Core;

use Core\Models\Produto\Produto;

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

        CreateProductStock::create(array_merge([
            'produto_sku' => $product->sku,
        ], is_null($stock) ? [] : [
            'quantity'    => $stock
        ]));

        return $product->fresh();
    }

    /**
    * Cria um objeto de produto seminovo
    *
    * @return Core\Models\Produto\Produto
    */
    public static function createSeminovo($data = [])
    {
        return factory(Produto::class)->create(array_merge($data, [
            'estado' => 1
        ]));
    }
}
