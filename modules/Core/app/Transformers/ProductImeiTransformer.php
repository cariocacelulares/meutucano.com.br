<?php namespace Core\Transformers;

/**
 * Class ProductImeiTransformer
 * @package Core\Transformers
 */
class ProductImeiTransformer
{
    /**
     * @param  object $productImeis
     * @return array
     */
    public static function listBySku($productImeis)
    {
        $data = [];
        foreach ($productImeis as $productImei) {
            $data[] = [
                'id'            => $productImei->id,
                'imei'          => $productImei->imei,
                'created_at'    => dateConvert($productImei->created_at),
                'product_stock' => [
                    'id'    => $productImei->productStock->id,
                    'stock' => [
                        'id'    => $productImei->productStock->stock->id,
                        'title' => $productImei->productStock->stock->title,
                    ],
                ],
            ];
        }

        return $data;
    }
}
