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
    public static function list($defects)
    {
        $pagination  = $defects->toArray();
        $transformed = [];

        foreach ($defects as $defect) {
            $transformed[] = [
                'id'          => $defect->id,
                'description' =>$defect->description,
                'created_at'  => dateConvert($defect->created_at),
                'product'     => [
                    'sku'    => $defect->productImei->productStock->product->sku,
                    'titulo' => $defect->productImei->productStock->product->titulo,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
