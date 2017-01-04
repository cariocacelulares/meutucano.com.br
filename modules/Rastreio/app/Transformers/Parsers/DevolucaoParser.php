<?php namespace Rastreio\Transformers\Parsers;

/**
 * Class DevolucaoParser
 * @package Rastreio\Transformers\Parsers
 */
class DevolucaoParser
{
    public static function getMotivoDescription($motivo)
    {
        return ($motivo >= 0) ? \Config::get('rastreio.devolucao_status')[$motivo] : null;
    }
}
