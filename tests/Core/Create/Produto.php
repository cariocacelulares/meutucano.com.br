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

        $serial = isset($data['serial_enabled']) ? $data['serial_enabled'] : null;
        unset($data['serial_enabled']);

        $product = factory(ProdutoModel::class)->create($data);

        $productStock = ProductStockModel
            ::join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
            ->where('product_sku', '=', $product->sku)
            ->where('stocks.include', '=', true)
            ->orderBy('stocks.priority', 'ASC')
            ->first();

        if ($productStock && $stock) {
            $productStock->quantity       = $stock;
            $productStock->serial_enabled = $serial;

            $productStock->save();
        } else if (!$productStock) {
            ProductStock::create(array_merge([
                'product_sku'    => $product->sku,
            ], is_null($stock) ? [] : [
                'quantity'       => $stock
            ], is_null($serial) ? [] : [
                'serial_enabled' => $serial
            ]), true);
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
