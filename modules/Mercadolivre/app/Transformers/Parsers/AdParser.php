<?php namespace Mercadolivre\Transformers\Parsers;

/**
 * Class AdParser
 * @package Mercadolivre\Transformers\Parsers
 */
class AdParser
{
    /**
     * Transform shipping description
     *
     * @param  int $shipping
     * @return string
     */
    public static function getShippingDescription($shipping)
    {
        switch ($shipping) {
            case '0': 
                return 'Não';
            case '1':
                return 'Sim';
            default: return;
        }
    }

    /**
     * Transform type description
     *
     * @param  int $type
     * @return string
     */
    public static function getTypeDescription($type)
    {
        switch ($type) {
            case '0':
                return 'Clássico';
            case '1':
                return 'Premium';
            default: return;
        }
    }

    /**
     * Transform status description
     *
     * @param  int $status
     * @return string
     */
    public static function getStatusDescription($status)
    {
        switch ($status) {
            case 1:
                return 'Ativo'; // Anúncio publicado
            case 2:
                return 'Pausado'; // Anúncio pausado por usuário
            default:
                return 'Pendente'; // Pendência de erro ou não salvo
        }
    }
}
