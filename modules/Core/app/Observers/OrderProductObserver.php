<?php namespace Core\Observers;

use Core\Models\OrderProduct;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductUpdated;
use Core\Events\OrderProductDeleting;
use Core\Events\OrderProductProductChanged;
use Illuminate\Support\Facades\Event;

class OrderProductObserver
{
    /**
     * Listen to the OrderProduct updated event.
     *
     * @param  OrderProduct $orderProduct
     * @return void
     */
    public function updated(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductUpdated($orderProduct));

        $dirty = $orderProduct->getDirty();

        if (isset($dirty['product_sku'])) {
            Event::fire(new OrderProductProductChanged($orderProduct));
        }
    }

    /**
     * Listen to the OrderProduct created event.
     *
     * @param  OrderProduct $orderProduct
     * @return void
     */
    public function created(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductCreated($orderProduct));
    }

    /**
     * Listen to the Pedido deleting event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function deleting(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductDeleting($orderProduct));
    }
}
