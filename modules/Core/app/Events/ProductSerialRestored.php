<?php namespace Core\Events;

use Core\Models\ProductSerial;
use Illuminate\Queue\SerializesModels;

class ProductSerialRestored extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerial $serial
     */
    public $serial;

    /**
     * @return void
     */
    public function __construct(ProductSerial $serial)
    {
        \Log::debug('Evento ProductSerialRestored disparado');
        $this->serial = $serial;
    }
}
