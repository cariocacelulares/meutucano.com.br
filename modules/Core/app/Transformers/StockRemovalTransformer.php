<?php namespace Core\Transformers;

/**
 * Class StockRemovalTransformer
 * @package Core\Transformers
 */
class StockRemovalTransformer
{
    /**
     * @param  object $removal
     * @return array
     */
    public static function show($removal)
    {
        $removalProducts = [];
        foreach ($removal->removalProducts as $removalProduct) {
            $removalProducts[] = StockRemovalProductTransformer::show($removalProduct);
        }

        return [
            'id'               => $removal->id,
            'is_continuous'    => $removal->is_continuous,
            'user_id'          => $removal->user_id ? (string) $removal->user_id : null,
            'created_at'       => dateConvert($removal->created_at),
            'closed_at'        => dateConvert($removal->closed_at),
            'removal_products' => $removalProducts,
            'user'             => [
                'id'   => $removal->user->id,
                'name' => $removal->user->name,
            ],
        ];
    }

    /**
     * @param  object $removal
     * @return Removal
     */
    public static function list($removals)
    {
        $pagination  = $removals->toArray();
        $transformed = [];

        foreach ($removals as $removal) {
            $transformed[] = [
                'id'            => $removal->id,
                'is_continuous' => $removal->is_continuous,
                'user_id'       => $removal->user_id ? (string) $removal->user_id : null,
                'created_at'    => dateConvert($removal->created_at),
                'closed_at'     => dateConvert($removal->closed_at),
                'user'          => [
                    'id'   => $removal->user->id,
                    'name' => $removal->user->name,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
