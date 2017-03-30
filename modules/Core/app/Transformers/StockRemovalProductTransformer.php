<?php namespace Core\Transformers;

use Core\Transformers\Parsers\StockRemovalProductParser;

/**
 * Class StockRemovalProductTransformer
 * @package Core\Transformers
 */
class StockRemovalProductTransformer
{
    /**
     * @param  object $removal
     * @return array
     */
    public static function show($removalProduct)
    {
        $productStocks = [];
        foreach ($removalProduct->productStock->product->productStocks as $productStock) {
            $productStocks[] = [
                'id'         => (string) $productStock->id,
                'stock_slug' => $productStock->stock_slug,
                'stock'      => [
                    'slug'  => $productStock->stock->slug,
                    'title' => $productStock->stock->title,
                ]
            ];
        }

        return [
            'id'                 => $removalProduct->id,
            'product_imei_id'    => $removalProduct->product_imei_id,
            'product_stock_id'   => (string) $removalProduct->product_stock_id,
            'stock_removal_id'   => $removalProduct->stock_removal_id,
            'status'             => $removalProduct->status,
            'status_description' => StockRemovalProductParser::getStatusDescription($removalProduct->status),
            'imei'               => $removalProduct->productImei->imei,
            'sku'                => $removalProduct->productStock->product_sku,
            'title'              => $removalProduct->productStock->product->titulo,
            'stock'              => $removalProduct->productStock->stock->title,
            'productStocks'      => $productStocks,
        ];
    }
}
