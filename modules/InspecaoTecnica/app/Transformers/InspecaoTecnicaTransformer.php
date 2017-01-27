<?php namespace InspecaoTecnica\Transformers;

use InspecaoTecnica\Transformers\Parsers\InspecaoTecnicaParser;
use Core\Transformers\Parsers\OrderParser;

/**
 * Class InspecaoTecnicaTransformer
 * @package InspecaoTecnica\Transformers
 */
class InspecaoTecnicaTransformer
{
    /**
     * @param  object $inspecoesTecnicas
     * @return array
     */
    public static function listBySku($inspecoesTecnicas)
    {
        $data = [];
        foreach ($inspecoesTecnicas as $inspecaoTecnica) {
            $data[] = [
                'id' => $inspecaoTecnica->id
            ];
        }

        return $data;
    }

    /**
     * @param  object $inspecoes
     * @return array
     */
    public static function solicitadas($inspecoes)
    {
        $pagination  = $inspecoes->toArray();
        $transformed = [];

        foreach ($inspecoes as $inspecao) {
            $transformed[] = [
                'id'                   => $inspecao->id,
                'priorizado'           => $inspecao->priorizado,
                'created_at'           => dateConvert($inspecao->created_at),
                'revisado_at'          => $inspecao->revisado_at,
                'revisado_at_readable' => dateConvert($inspecao->revisado_at),
                'pedido_produto'       => (!$inspecao->pedido_produto) ? null : [
                    'pedido' => (!$inspecao->pedido_produto->pedido) ? null : [
                        'id'                   => $inspecao->pedido_produto->pedido->id,
                        'marketplace_readable' => OrderParser::getMarketplaceReadable($inspecao->pedido_produto->pedido->marketplace),
                        'codigo_marketplace'   => $inspecao->pedido_produto->pedido->codigo_marketplace,
                    ],
                ],
                'produto'              => (!$inspecao->produto) ? null : [
                    'sku'     => $inspecao->produto->sku,
                    'titulo'  => $inspecao->produto->titulo,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $inspecoes
     * @return array
     */
    public static function fila($inspecoes)
    {
        $pagination  = $inspecoes->toArray();
        $transformed = [];

        foreach ($inspecoes as $inspecao) {
            $transformed[] = [
                'id'             => $inspecao->id,
                'priorizado'     => $inspecao->priorizado,
                'solicitante_id' => $inspecao->solicitante_id,
                'created_at'     => dateConvert($inspecao->created_at),
                'solicitante'    => (!$inspecao->solicitante) ? null : [
                    'id'   => $inspecao->solicitante->id,
                    'name' => $inspecao->solicitante->name,
                ],
                'pedido_produto' => (!$inspecao->pedido_produto) ? null : [
                    'pedido' => (!$inspecao->pedido_produto->pedido) ? null : [
                        'id'                   => $inspecao->pedido_produto->pedido->id,
                        'marketplace_readable' => OrderParser::getMarketplaceReadable($inspecao->pedido_produto->pedido->marketplace),
                        'codigo_marketplace'   => $inspecao->pedido_produto->pedido->codigo_marketplace,
                    ],
                ],
                'produto'        => (!$inspecao->produto) ? null : [
                    'sku'     => $inspecao->produto->sku,
                    'titulo'  => $inspecao->produto->titulo,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $inspecoes
     * @return array
     */
    public static function list($inspecoes)
    {
        $pagination  = $inspecoes->toArray();
        $transformed = [];

        foreach ($inspecoes as $inspecao) {
            $transformed[] = [
                'id'             => $inspecao->id,
                'priorizado'     => $inspecao->priorizado,
                'solicitante_id' => $inspecao->solicitante_id,
                'reservado'      => $inspecao->reservado,
                'usuario'        => $inspecao->usuario,
                'created_at'     => dateConvert($inspecao->created_at),
                'solicitante'    => (!$inspecao->solicitante) ? null : [
                    'id'   => $inspecao->solicitante->id,
                    'name' => $inspecao->solicitante->name,
                ],
                'pedido_produto' => (!$inspecao->pedido_produto) ? null : [
                    'pedido' => (!$inspecao->pedido_produto->pedido) ? null : [
                        'id'                   => $inspecao->pedido_produto->pedido->id,
                        'marketplace_readable' => OrderParser::getMarketplaceReadable($inspecao->pedido_produto->pedido->marketplace),
                        'codigo_marketplace'   => $inspecao->pedido_produto->pedido->codigo_marketplace,
                    ],
                ],
                'produto'        => (!$inspecao->produto) ? null : [
                    'sku'     => $inspecao->produto->sku,
                    'titulo'  => $inspecao->produto->titulo,
                ],
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }
}
