<?php namespace Core\Observers;

use Core\Models\Order;
use Core\Events\OrderPaid;
use Core\Events\OrderSent;
use Core\Events\OrderSaved;
use Core\Events\OrderCreated;
use Core\Events\OrderUpdated;
use Core\Events\OrderCanceled;
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
                case 1: // Pago
                    Event::fire(new OrderPaid($order));
                    break;
                case 2: // Enviado
                    Event::fire(new OrderSent($order));
                    break;
                case 3: // Entregue
                    Event::fire(new OrderDelivered($order));
                    break;
                case 5: // Cancelado
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

    /**
     * Listen to the Order deleting event.
     *
     * @param  Order  $order
     * @return void
     */
    public function deleting(Order $order)
    {
        $order->invoices()->delete();
        $order->shipments()->delete();
    }

    /**
     * Listen to the Order restoring event.
     *
     * @param  Order  $order
     * @return void
     */
    public function restoring(Order $order)
    {
        $order->invoices()->withTrashed()->restore();
        $order->shipments()->withTrashed()->restore();
    }
}
