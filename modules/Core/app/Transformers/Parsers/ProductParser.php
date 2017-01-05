<?php namespace Core\Transformers\Parsers;

/**
 * Class ProductParser
 * @package Core\Transformers\Parsers
 */
class ProductParser
{
    public static function getEstadoDescription($estado)
    {
       switch ($estado) {
           case '0':
               return 'Novo';
           case '1':
               return 'Seminovo';
           default:
               return 'Novo';
       }
    }
}
