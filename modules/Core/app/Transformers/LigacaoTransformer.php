<?php namespace Core\Transformers;

use Core\Transformers\Parsers\LigacaoParser;

/**
 * Class LigacaoTransformer
 * @package Core\Transformers
 */
class LigacaoTransformer
{
    /**
     * @param  object $orders
     * @return array
     */
    public static function tableList($orders)
    {
        $data = [];
        foreach ($orders as $order) {
            $data[] = [
                'id'              => $order->id,
                'usuario'         => $order->usuario,
                'created_at_diff' => diffForHumans($order->created_at),
                'arquivo'         => $order->arquivo,
            ];
        }

        return $data;
    }
}
