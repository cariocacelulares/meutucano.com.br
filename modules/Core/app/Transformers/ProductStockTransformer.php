<?php namespace Core\Transformers;

/**
 * Class ProductStockTransformer
 * @package Core\Transformers
 */
class ProductStockTransformer
{
    /**
     * @param  object $productStock
     * @return array
     */
    public static function listBySlug($productStocks)
    {
        $pagination  = $productStocks->toArray();
        $transformed = [];

        foreach ($productStocks as $productStock) {
            $transformed[] = [
                'id'             => $productStock->id,
                'serial_enabled' => $productStock->serial_enabled,
                'quantity'       => $productStock->quantity,
                'updated_at'     => dateConvert($productStock->updated_at),
                'product'        => [
                    'sku'    => $productStock->product->sku,
                    'titulo' => $productStock->product->titulo,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
