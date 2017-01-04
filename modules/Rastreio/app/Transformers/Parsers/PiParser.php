<?php namespace Rastreio\Transformers\Parsers;

/**
 * Class PiParser
 * @package Rastreio\Transformers\Parsers
 */
class PiParser
{
    public static function getMotivoDescription($motivo_status)
    {
        switch ((int) $motivo_status) {
            case 0  : return 'Outro';
            case 2  : return 'Atraso';
            case 3  : return 'Extravio';
            default : return 'Outro';
        }
    }

    public static function getStatusDescription($motivo_status)
    {
        return ($motivo_status) ? \Config::get('rastreio.status')[$motivo_status] : null;
    }
}
