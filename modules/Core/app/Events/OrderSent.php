<?php namespace Core\Events;

use Core\Models\Order;
use Illuminate\Queue\SerializesModels;

class OrderSent extends \Event
{
    use SerializesModels;

    /**
     * @param Order $order
     */
    public $order;

    /**
     * @return void
     */
    public function __construct(Order $order)
    {
        \Log::debug('Evento OrderSent disparado');
        $this->order = $order;
    }
}
