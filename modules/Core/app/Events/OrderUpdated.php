<?php namespace Core\Events;

use Core\Models\Order;
use Illuminate\Queue\SerializesModels;

class OrderUpdated extends \Event
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
        \Log::debug('Evento OrderUpdated disparado');
        $this->order = $order;
    }
}
