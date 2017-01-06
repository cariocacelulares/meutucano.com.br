<?php namespace Core\Transformers\Parsers;

/**
 * Class AddressParser
 * @package Core\Transformers\Parsers
 */
class AddressParser
{
    /**
     * Beautify postal code string
     *
     * @param  string $cep
     * @return string
     */
    public static function getCepReadable($cep)
    {
       if (strlen($cep) == 8) {
           return substr($cep, 0, 5) . '-' . substr($cep, -3);
       } elseif (strlen($cep) == 7) {
           $cep = '0' . $cep;

           return AddressParser::getCepReadable($cep);
       }
    }
}
