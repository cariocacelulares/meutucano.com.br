<?php namespace Core\Transformers\Traits;

use Carbon\Carbon;

/**
 * Class TransformerTrait
 * @package Core\Transformers\Trait
 */
trait TransformerTrait
{
    public function dateConvert($date = null, $from = 'Y-m-d H:i:s', $to = 'd/m/Y')
    {
        if (!$date) {
            return null;
        }

        return \Carbon\Carbon::createFromFormat($from, $date)->format($to);
    }

   public function getCepReadable($cep)
   {
       if (strlen($cep) == 8) {
           return substr($cep, 0, 5) . '-' . substr($cep, -3);
       } elseif (strlen($cep) == 7) {
           $cep = '0' . $cep;

           return $this->getCepReadable($cep);
       }
   }
}
