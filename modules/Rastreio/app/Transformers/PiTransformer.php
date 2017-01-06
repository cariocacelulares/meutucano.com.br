<?php namespace Rastreio\Transformers;

use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;
use Core\Transformers\Parsers\OrderParser;
use Rastreio\Transformers\Parsers\RastreioParser;
use Rastreio\Transformers\Parsers\PiParser;

/**
 * Class PiTransformer
 * @package Rastreio\Transformers
 */
class PiTransformer
{
    /**
     * @param  object $pis
     * @return array
     */
    public static function pending($pis)
    {
        $pagination  = $pis->toArray();
        $transformed = [];

        foreach ($pis as $pi) {
            $transformed[] = [
                'id'                 => $pi['id'],
                'created_at'         => dateConvert($pi['created_at']),
                'codigo_pi'          => $pi['codigo_pi'],
                'rastreio_id'        => $pi['rastreio_id'],
                'motivo_status'      => $pi['motivo_status'],
                'status_description' => PiParser::getMotivoDescription($pi['motivo_status']),
                'rastreio'           => [
                    'id'           => $pi['rastreio']['id'],
                    'rastreio_url' => $pi['rastreio']['rastreio_url'],
                    'rastreio'     => $pi['rastreio']['rastreio'],
                    'pedido'       => [
                        'id'                 => $pi['rastreio']['pedido']['id'],
                        'marketplace'        => OrderParser::getMarketplaceReadable($pi['rastreio']['pedido']['marketplace']),
                        'codigo_marketplace' => $pi['rastreio']['pedido']['codigo_marketplace'],
                        'cliente'  => [
                            'id'   => $pi['rastreio']['pedido']['cliente']['id'],
                            'nome' => $pi['rastreio']['pedido']['cliente']['nome'],
                            'fone' => $pi['rastreio']['pedido']['cliente']['fone'],
                        ],
                        'endereco' => [
                            'id'           => $pi['rastreio']['pedido']['endereco']['id'],
                            'cep'          => $pi['rastreio']['pedido']['endereco']['cep'],
                            'cep_readable' => AddressParser::getCepReadable($pi['rastreio']['pedido']['endereco']['cep']),
                            'cidade'       => $pi['rastreio']['pedido']['endereco']['cidade'],
                            'uf'           => $pi['rastreio']['pedido']['endereco']['uf'],
                        ],
                    ],
                ]
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
