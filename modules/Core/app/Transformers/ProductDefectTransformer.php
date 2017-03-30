<?php namespace Core\Transformers;

/**
 * Class ProductDefectTransformer
 * @package Core\Transformers
 */
class ProductDefectTransformer
{
    /**
     * @param  object $defect
     * @return Removal
     */
    public static function tableList($defects)
    {
        $pagination  = $defects->toArray();
        $transformed = [];

        foreach ($defects as $defect) {
            $transformed[] = [
                'id'          => $defect->id,
                'description' => $defect->description,
                'created_at'  => dateConvert($defect->created_at),
                'product'     => [
                    'sku'    => $defect->product->sku,
                    'titulo' => $defect->product->titulo,
                ],
                'productImei' => [
                    'id'   => $defect->productImei->id,
                    'imei' => $defect->productImei->imei,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
