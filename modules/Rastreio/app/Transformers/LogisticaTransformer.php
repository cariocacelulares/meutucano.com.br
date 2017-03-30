<?php namespace Rastreio\Transformers;

use Rastreio\Transformers\Parsers\RastreioParser;

/**
 * Class LogisticaTransformer
 * @package Rastreio\Transformers
 */
class LogisticaTransformer
{
    /**
     * @param  object $logistica
     * @return array
     */
    public static function show($logistica)
    {
        return [
            'id'                  => $logistica->id,
            'rastreio_id'         => $logistica->rastreio_id,
            'autorizacao'         => $logistica->autorizacao,
            'motivo'              => $logistica->motivo,
            'acao'                => $logistica->acao,
            'observacoes'         => $logistica->observacoes,
            'protocolo'           => RastreioParser::getProtocolo($logistica),
            'imagem_cancelamento' => RastreioParser::getImagemCancelamento($logistica),
            'rastreio'            => [
                'id'     => $logistica->rastreio->id,
                'pedido' => [
                    'id'          => $logistica->rastreio->pedido->id,
                    'marketplace' => $logistica->rastreio->pedido->marketplace,
                ],
            ],
        ];
    }
}
