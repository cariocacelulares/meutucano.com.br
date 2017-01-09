<?php namespace Rastreio\Transformers;

use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;
use Core\Transformers\Parsers\OrderParser;
use Rastreio\Transformers\Parsers\RastreioParser;

/**
 * Class RastreioTransformer
 * @package Rastreio\Transformers
 */
class RastreioTransformer
{
    /**
     * @param  object $rastreios
     * @return array
     */
    public static function important($rastreios)
    {
        $pagination  = $rastreios->toArray();
        $transformed = [];

        foreach ($rastreios as $rastreio) {
            $transformed[] = [
                'id'                  => $rastreio['id'],
                'prazo'               => $rastreio['prazo'],
                'rastreio_url'        => RastreioParser::getRastreioUrl($rastreio['rastreio']),
                'rastreio'            => $rastreio['rastreio'],
                'status'              => $rastreio['status'],
                'status_description'  => RastreioParser::getStatusDescription($rastreio['status']),
                'data_envio'          => $rastreio['data_envio'],
                'data_envio_readable' => dateConvert($rastreio['data_envio'], 'Y-m-d', 'd/m/Y'),
                'prazo_date'          => RastreioParser::getPrazoDate($rastreio['data_envio'], $rastreio['prazo']),
                'pedido'              => [
                    'id'                 => $rastreio['pedido']['id'],
                    'marketplace'        => OrderParser::getMarketplaceReadable($rastreio['pedido']['marketplace']),
                    'codigo_marketplace' => $rastreio['pedido']['codigo_marketplace'],
                    'cliente'            => [
                        'id'   => $rastreio['pedido']['cliente']['id'],
                        'nome' => $rastreio['pedido']['cliente']['nome'],
                        'fone' => $rastreio['pedido']['cliente']['fone'],
                    ],
                    'endereco'           => [
                        'id'           => $rastreio['pedido']['endereco']['id'],
                        'cep'          => $rastreio['pedido']['endereco']['cep'],
                        'cep_readable' => AddressParser::getCepReadable($rastreio['pedido']['endereco']['cep']),
                        'cidade'       => $rastreio['pedido']['endereco']['cidade'],
                        'uf'           => $rastreio['pedido']['endereco']['uf'],
                    ],
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $monitorados
     * @return array
     */
    public static function monitorado($monitorados)
    {
        $pagination  = $monitorados->toArray();
        $transformed = [];

        foreach ($monitorados as $monitorado) {
            $transformed[] = [
                'id'          => $monitorado['id'],
                'rastreio_id' => $monitorado['rastreio_id'],
                'rastreio'    => [
                    'prazo'               => $monitorado['rastreio']['prazo'],
                    'rastreio_url'        => RastreioParser::getRastreioUrl($monitorado['rastreio']['rastreio']),
                    'rastreio'            => $monitorado['rastreio']['rastreio'],
                    'status'              => $monitorado['rastreio']['status'],
                    'status_description'  => RastreioParser::getStatusDescription($monitorado['rastreio']['status']),
                    'data_envio'          => $monitorado['rastreio']['data_envio'],
                    'data_envio_readable' => dateConvert($monitorado['rastreio']['data_envio'], 'Y-m-d', 'd/m/Y'),
                    'prazo_date'          => RastreioParser::getPrazoDate($monitorado['rastreio']['data_envio'], $monitorado['rastreio']['prazo']),
                    'pedido'              => [
                        'id'                 => $monitorado['rastreio']['pedido']['id'],
                        'marketplace'        => OrderParser::getMarketplaceReadable($monitorado['rastreio']['pedido']['marketplace']),
                        'codigo_marketplace' => $monitorado['rastreio']['pedido']['codigo_marketplace'],
                        'cliente'            => [
                            'id'   => $monitorado['rastreio']['pedido']['cliente']['id'],
                            'nome' => $monitorado['rastreio']['pedido']['cliente']['nome'],
                            'fone' => $monitorado['rastreio']['pedido']['cliente']['fone'],
                        ],
                        'endereco'           => [
                            'id'           => $monitorado['rastreio']['pedido']['endereco']['id'],
                            'cep'          => $monitorado['rastreio']['pedido']['endereco']['cep'],
                            'cep_readable' => AddressParser::getCepReadable($monitorado['rastreio']['pedido']['endereco']['cep']),
                            'cidade'       => $monitorado['rastreio']['pedido']['endereco']['cidade'],
                            'uf'           => $monitorado['rastreio']['pedido']['endereco']['uf'],
                        ],
                    ],
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
