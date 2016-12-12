<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido\PedidoProduto;

class OrderProductQtyDecreased extends \Event
{
    use SerializesModels;

    public $orderProduct;
    public $qty;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(PedidoProduto $orderProduct, $qty)
    {
        \Log::debug('Evento OrderProductQtyDecreased disparado');
        $this->orderProduct = $orderProduct;
        $this->qty          = $qty;
    }
}