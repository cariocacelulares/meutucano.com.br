<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido\PedidoProduto;

class OrderProductUpdated extends \Event
{
    use SerializesModels;

    public $orderProduct;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(PedidoProduto $orderProduct)
    {
        \Log::debug('Evento OrderProductUpdated disparado');
        $this->orderProduct = $orderProduct;
    }
}