<?php namespace Core\Events;

use Core\Models\ProductSerial;
use Illuminate\Queue\SerializesModels;

class ProductSerialDeleted extends \Event
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
        \Log::debug('Evento ProductSerialDeleted disparado');
        $this->serial = $serial;
    }
}
