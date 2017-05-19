<?php namespace Core\Events;

use Core\Models\ProductSerial;
use Illuminate\Queue\SerializesModels;

class ProductSerialDeleted extends \Event
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
        \Log::debug('Evento ProductSerialDeleted disparado');
        $this->productSerial = $productSerial;
    }
}
