<?php namespace Core\Events;

use Core\Models\Order;
use Illuminate\Queue\SerializesModels;

class OrderCanceled extends \Event
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
        \Log::debug('Evento OrderCanceled disparado');
        $this->order = $order;
    }
}
