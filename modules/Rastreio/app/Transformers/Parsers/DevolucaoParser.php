<?php namespace Rastreio\Transformers\Parsers;

/**
 * Class DevolucaoParser
 * @package Rastreio\Transformers\Parsers
 */
class DevolucaoParser
{
    /**
     * Transform motivo code to string description
     *
     * @param  int|string $motivo
     * @return string
     */
    public static function getMotivoDescription($motivo)
    {
        return ($motivo >= 0) ? \Config::get('rastreio.devolucao_status')[$motivo] : null;
    }
}
