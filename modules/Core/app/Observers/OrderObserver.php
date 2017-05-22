<?php namespace Core\Observers;

use Core\Models\Order;
use Core\Events\OrderPaid;
use Core\Events\OrderSaved;
use Core\Events\OrderCreated;
use Core\Events\OrderUpdated;
use Core\Events\OrderCanceled;
use Core\Events\OrderInvoiced;
use Core\Events\OrderDelivered;
use Illuminate\Support\Facades\Event;

class OrderObserver
{
    /**
     * Listen to the Order saved event.
     *
     * @param  Order  $order
     * @return void
     */
    public function saved(Order $order)
    {
        Event::fire(new OrderSaved($order));

        $dirty = $order->getDirty();
        if (isset($dirty['status'])) {
            $status = ((is_null($order->status)) ? null : (int) $order->status);

            switch ($status) {
                case Order::STATUS_PAID:
                    Event::fire(new OrderPaid($order));
                    break;
                case Order::STATUS_INVOICED:
                    Event::fire(new OrderInvoiced($order));
                    break;
                case Order::STATUS_COMPLETE:
                    Event::fire(new OrderDelivered($order));
                    break;
                case Order::STATUS_CANCELED: // Cancelado
                    Event::fire(new OrderCanceled($order));
                    break;
            }
        }
    }

    /**
     * Listen to the Order updated event.
     *
     * @param  Order  $order
     * @return void
     */
    public function updated(Order $order)
    {
        Event::fire(new OrderUpdated($order));
    }

    /**
     * Listen to the Order created event.
     *
     * @param  Order  $order
     * @return void
     */
    public function created(Order $order)
    {
        Event::fire(new OrderCreated($order));
    }
}
