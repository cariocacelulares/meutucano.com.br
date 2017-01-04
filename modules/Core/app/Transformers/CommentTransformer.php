<?php namespace Core\Transformers;

use Core\Transformers\Parsers\CommentParser;

/**
 * Class CommentTransformer
 * @package Core\Transformers
 */
class CommentTransformer
{
    public static function list($orders)
    {
        $data = [];
        foreach ($orders as $order) {
            $data[] = [
                'id'              => $order->id,
                'usuario'         => $order->usuario,
                'created_at_diff' => CommentParser::getCreatedAtDiff($order->created_at),
                'comentario'      => $order->comentario,
            ];
        }

        return $data;
    }
}
