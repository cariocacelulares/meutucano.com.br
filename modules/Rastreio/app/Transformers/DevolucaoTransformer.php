<?php namespace Rastreio\Transformers;

use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;
use Core\Transformers\Parsers\OrderParser;
use Rastreio\Transformers\Parsers\RastreioParser;
use Rastreio\Transformers\Parsers\DevolucaoParser;

/**
 * Class DevolucaoTransformer
 * @package Rastreio\Transformers
 */
class DevolucaoTransformer
{
    public static function pending($devolucoes)
    {
        $pagination  = $devolucoes->toArray();
        $transformed = [];

        foreach ($devolucoes as $devolucao) {
            $transformed[] = [
                'id'                 => $devolucao['id'],
                'created_at'         => dateConvert($devolucao['created_at']),
                'rastreio_id'        => $devolucao['rastreio_id'],
                'motivo'             => $devolucao['motivo'],
                'motivo_description' => DevolucaoParser::getMotivoDescription($devolucao['motivo']),
                'rastreio'           => [
                    'id'           => $devolucao['rastreio']['id'],
                    'rastreio_url' => $devolucao['rastreio']['rastreio_url'],
                    'rastreio'     => $devolucao['rastreio']['rastreio'],
                    'pedido'       => [
                        'id'                 => $devolucao['rastreio']['pedido']['id'],
                        'marketplace'        => OrderParser::getMarketplaceReadable($devolucao['rastreio']['pedido']['marketplace']),
                        'codigo_marketplace' => $devolucao['rastreio']['pedido']['codigo_marketplace'],
                        'cliente'  => [
                            'id'   => $devolucao['rastreio']['pedido']['cliente']['id'],
                            'nome' => $devolucao['rastreio']['pedido']['cliente']['nome'],
                            'fone' => $devolucao['rastreio']['pedido']['cliente']['fone'],
                        ],
                        'endereco' => [
                            'id'           => $devolucao['rastreio']['pedido']['endereco']['id'],
                            'cep'          => $devolucao['rastreio']['pedido']['endereco']['cep'],
                            'cep_readable' => AddressParser::getCepReadable($devolucao['rastreio']['pedido']['endereco']['cep']),
                            'cidade'       => $devolucao['rastreio']['pedido']['endereco']['cidade'],
                            'uf'           => $devolucao['rastreio']['pedido']['endereco']['uf'],
                        ],
                    ],
                ]
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
