<?php namespace Core\Events;

use Core\Models\Order;
use Illuminate\Queue\SerializesModels;

class OrderCreated extends \Event
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
        \Log::debug('Evento OrderCreated disparado');
        $this->order = $order;
    }
}
