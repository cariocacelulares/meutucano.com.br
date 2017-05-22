<?php namespace Core\Observers;

use Core\Models\OrderProduct;
use Core\Events\OrderProductSaved;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductUpdated;
use Core\Events\OrderProductDeleted;
use Illuminate\Support\Facades\Event;
use Core\Events\OrderProductProductChanged;

class OrderProductObserver
{
    /**
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
     * @param  OrderProduct $orderProduct
     * @return void
     */
    public function saved(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductSaved($orderProduct));
    }

    /**
     * @param  OrderProduct $orderProduct
     * @return void
     */
    public function created(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductCreated($orderProduct));
    }

    /**
     * @param  Pedido  $order
     * @return void
     */
    public function deleted(OrderProduct $orderProduct)
    {
        Event::fire(new OrderProductDeleted($orderProduct));
    }
}
