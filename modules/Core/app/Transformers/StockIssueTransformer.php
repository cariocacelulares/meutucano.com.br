<?php namespace Core\Transformers;

/**
 * Class StockIssueTransformer
 * @package Core\Transformers
 */
class StockIssueTransformer
{
    /**
     * @param  object $issue
     * @return Removal
     */
    public static function list($issues)
    {
        $pagination  = $issues->toArray();
        $transformed = [];

        foreach ($issues as $issue) {
            $transformed[] = [
                'id'           => $issue->id,
                'user_id'      => $issue->user_id ? (string) $issue->user_id : null,
                'reason'       => $issue->reason,
                'description'  =>$issue->description,
                'created_at'   => dateConvert($issue->created_at),
                'user'         => !$issue->user ? [] : [
                    'id'   => $issue->user->id,
                    'name' => $issue->user->name,
                ],
                'product_imei' =>[
                    'id'            => $issue->productImei->id,
                    'imei'          => $issue->productImei->imei,
                    'product_stock' => [
                        'id'      =>$issue->productImei->productStock->id,
                        'product' =>[
                            'sku'    => $issue->productImei->productStock->product->sku,
                            'titulo' => $issue->productImei->productStock->product->titulo,
                        ],
                        'stock'   =>[
                            'slug'  => $issue->productImei->productStock->stock->slug,
                            'title' => $issue->productImei->productStock->stock->title,
                        ],
                    ],
                ]
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
