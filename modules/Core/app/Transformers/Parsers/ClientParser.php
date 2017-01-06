<?php namespace Core\Transformers\Parsers;

/**
 * Class ClientParser
 * @package Core\Transformers\Parsers
 */
class ClientParser
{
    /**
     * Beautify taxvat string
     * 
     * @param  string $taxvat
     * @param  int|string $tipo
     * @return string
     */
    public static function getTaxvatReadable($taxvat, $tipo)
    {
       $taxvat = preg_replace('/\D/', '', $taxvat);
       $format = [];

       if ((int)$tipo === 1) {
           // CNPJ
           for ($i = 0; $i < strlen($taxvat); $i++) {
               $format[] = $taxvat[$i];

               if (in_array($i, [1, 4])) {
                   $format[] = '.';
               } elseif ($i == 6) {
                   $format[] = '/';
               } elseif ($i == 11) {
                   $format[] = '-';
               }
           }
       } else {
           // CPF
           for ($i = 0; $i < strlen($taxvat); $i++) {
               $format[] = $taxvat[$i];

               if (in_array($i, [2, 5])) {
                   $format[] = '.';
               } elseif ($i == 8) {
                   $format[] = '-';
               }
           }
       }

       return implode('', $format);
    }
}
