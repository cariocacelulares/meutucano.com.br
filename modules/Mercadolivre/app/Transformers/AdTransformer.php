<?php namespace Mercadolivre\Transformers;

use Core\Transformers\Parsers\ProductParser;
use Mercadolivre\Transformers\Parsers\AdParser;

/**
 * Class AdTransformer
 * @package Core\Transformers
 */
class AdTransformer
{
    /**
     * @param  object $products
     * @return array
     */
    public static function tableList($products)
    {
        $pagination  = $products->toArray();
        $transformed = [];

        foreach ($products as $product) {
            $ads = [];
            foreach ($product->mercadolivreAds as $ad) {
                $ads[] = [
                    'id'                 => $ad->id,
                    'code'               => $ad->code,
                    'permalink'          => $ad->permalink,
                    'title'              => $ad->title,
                    'price'              => $ad->price,
                    'type'               => AdParser::getTypeDescription($ad->type),
                    'shipping'           => AdParser::getShippingDescription($ad->shipping),
                    'status'             => $ad->status,
                    'status_description' => AdParser::getStatusDescription($ad->status)
                ];
            }

            $transformed[] = [
                'sku'                => $product->sku,
                'titulo'             => $product->titulo,
                'estado_description' => ProductParser::getEstadoDescription($product->estado),
                'ads'                => $ads
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
