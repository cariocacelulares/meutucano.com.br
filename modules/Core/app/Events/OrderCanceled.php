<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido;

class OrderCanceled extends \Event
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
        \Log::debug('Evento OrderCanceled disparado');
        $this->order = $order;
    }
}
