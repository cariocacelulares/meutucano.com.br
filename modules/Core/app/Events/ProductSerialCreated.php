<?php namespace Core\Events;

use Core\Models\ProductSerial;
use Illuminate\Queue\SerializesModels;

class ProductSerialCreated extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerial $productImei
     */
    public $serial;

    /**
     * @return void
     */
    public function __construct(ProductSerial $serial)
    {
        \Log::debug('Evento ProductSerialCreated disparado');
        $this->serial = $serial;
    }
}
