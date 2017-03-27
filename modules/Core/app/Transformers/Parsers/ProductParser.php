<?php namespace Core\Transformers\Parsers;

/**
 * Class ProductParser
 * @package Core\Transformers\Parsers
 */
class ProductParser
{
    /**
     * Transforme product state code to string
     *
     * @param  int|string $estado
     * @return string
     */
    public static function getEstadoDescription($estado)
    {
       switch ($estado) {
           case '0':
               return 'Novo';
           case '1':
               return 'Usado';
           default:
               return 'Novo';
       }
    }
}
