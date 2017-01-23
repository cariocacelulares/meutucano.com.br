<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido;

class OrderUpdated extends \Event
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
        \Log::debug('Evento OrderUpdated disparado');
        $this->order = $order;
    }
}
