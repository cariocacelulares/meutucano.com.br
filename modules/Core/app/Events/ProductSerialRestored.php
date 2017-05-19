<?php namespace Core\Events;

use Core\Models\ProductSerial;
use Illuminate\Queue\SerializesModels;

class ProductSerialRestored extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerial $productSerial
     */
    public $productSerial;

    /**
     * @return void
     */
    public function __construct(ProductSerial $productSerial)
    {
        \Log::debug('Evento ProductSerialRestored disparado');
        $this->productSerial = $productSerial;
    }
}
