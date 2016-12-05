<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Models\Pedido\PedidoProduto;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductUpdated;

class PedidoProdutoObserver
{
    /**
     * Listen to the PedidoProduto updated event.
     *
     * @param  PedidoProduto  $orderProduct
     * @return void
     */
    public function updated(PedidoProduto $orderProduct)
    {
        Event::fire(new OrderProductUpdated($orderProduct));
    }

    /**
     * Listen to the PedidoProduto created event.
     *
     * @param  PedidoProduto  $orderProduct
     * @return void
     */
    public function created(PedidoProduto $orderProduct)
    {
        Event::fire(new OrderProductCreated($orderProduct));
    }
}