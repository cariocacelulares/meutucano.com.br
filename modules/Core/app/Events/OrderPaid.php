<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Order;

class OrderPaid extends \Event
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
        \Log::debug('Evento OrderPaid disparado');
        $this->order = $order;
    }
}
