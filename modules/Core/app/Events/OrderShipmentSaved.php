<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\OrderShipment;

class OrderShipmentSaved extends \Event
{
    use SerializesModels;

    public $orderShipment;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(OrderShipment $orderShipment)
    {
        \Log::debug('Evento RastreioSaved disparado');
        $this->$orderShipment = $orderShipment;
    }
}
