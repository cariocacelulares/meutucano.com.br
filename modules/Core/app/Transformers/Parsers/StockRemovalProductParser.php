<?php namespace Core\Transformers\Parsers;

/**
 * Class StockRemovalProductParser
 * @package Core\Transformers\Parsers
 */
class StockRemovalProductParser
{
    /**
     * Transform removal product status code to string
     *
     * @param  int|string $status
     * @return string
     */
    public static function getStatusDescription($status)
    {
        if (!isset(\Config::get('core.stock_removal_status')[$status])) {
            return 'Desconhecido';
        } else {
            return \Config::get('core.stock_removal_status')[$status];
        }
    }
}
