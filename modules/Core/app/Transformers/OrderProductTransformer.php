<?php namespace Core\Transformers;

use Core\Transformers\Parsers\OrderParser;

/**
 * Class OrderProductTransformer
 * @package Core\Transformers
 */
class OrderProductTransformer
{
    /**
     * @param  object $orderProducts
     * @return array
     */
    public static function listBySku($orderProducts)
    {
        $data = [];
        foreach ($orderProducts as $orderProduct) {
            if (!isset($data[$orderProduct['status']])) {
                $data[$orderProduct['status']] = 1;
            } else {
                $data[$orderProduct['status']]++;
            }

            $data['data'][] = [
                'id'                 => $orderProduct['pedido']['id'],
                'status'             => $orderProduct['pedido']['status'],
                'status_description' => OrderParser::getStatusDescription($orderProduct['pedido']['status']),
                'codigo_marketplace' => $orderProduct['pedido']['codigo_marketplace'],
                'marketplace'        => $orderProduct['pedido']['marketplace'],
                // 'quantidade'         => $orderProduct['quantidade'],
                'valor'              => $orderProduct['valor'],
            ];
        }

        return $data;
    }
}
