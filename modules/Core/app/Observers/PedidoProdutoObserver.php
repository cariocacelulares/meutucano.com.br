<?php namespace Core\Observers;

use Core\Events\OrderProductCreated;
use Core\Events\OrderProductDeleting;
use Core\Events\OrderProductProductChanged;
use Core\Events\OrderProductQtyDecreased;
use Core\Events\OrderProductQtyIncreased;
use Core\Events\OrderProductUpdated;
use Core\Models\Pedido\PedidoProduto;
use Illuminate\Support\Facades\Event;

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

        // If qty is changed
        if (isset($dirty['quantidade'])) {
            $qty = [];
            $qty['old'] = $orderProduct->getOriginal('quantidade');
            $qty['new'] = $orderProduct->quantidade;

            if ($qty['new'] > $qty['old']) {
                Event::fire(new OrderProductQtyIncreased($orderProduct, ($qty['new'] - $qty['old'])));
            } elseif (($qty['new'] < $qty['old'])) {
                Event::fire(new OrderProductQtyDecreased($orderProduct, ($qty['old'] - $qty['new'])));
            }
        }

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
