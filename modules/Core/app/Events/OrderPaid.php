<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido;

class OrderPaid extends \Event
{
    use SerializesModels;

    public $order;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Pedido $order)
    {
        \Log::debug('Evento OrderPaid disparado');
        $this->order = $order;
    }
}
