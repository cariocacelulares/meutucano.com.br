<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductDeleting;
use Core\Events\OrderProductProductChanged;
use Core\Events\OrderProductQtyDecreased;
use Core\Events\OrderProductUpdated;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto\ProductStock;

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

        $dirty = $orderProduct->getDirty();

        // If product is changed
        if (isset($dirty['produto_sku'])) {
            Event::fire(new OrderProductProductChanged($orderProduct));
        }
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

    /**
     * Listen to the Pedido deleting event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function deleting(PedidoProduto $orderProduct)
    {
        Event::fire(new OrderProductDeleting($orderProduct));
    }
}
