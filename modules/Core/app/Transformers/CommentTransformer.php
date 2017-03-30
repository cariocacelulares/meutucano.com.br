<?php namespace Core\Transformers;

use Core\Transformers\Parsers\CommentParser;

/**
 * Class CommentTransformer
 * @package Core\Transformers
 */
class CommentTransformer
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
                'comentario'      => $order->comentario,
            ];
        }

        return $data;
    }
}
