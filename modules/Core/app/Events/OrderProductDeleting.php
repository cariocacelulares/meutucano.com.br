<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido\PedidoProduto;

class OrderProductDeleting extends \Event
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
        \Log::debug('Evento OrderProductDeleting disparado');
        $this->orderProduct = $orderProduct;
    }
}