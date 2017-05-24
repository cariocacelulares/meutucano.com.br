<?php namespace Core\Events\Handlers;

use Core\Models\Order;
use Core\Events\OrderCanceled;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

class SetRefund
{
    /**
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderCanceled::class,
            '\Core\Events\Handlers\SetRefund@onOrderCanceled'
        );
    }

    /**
     * @param  OrderCanceled  $event
     * @return void
     */
    public function onOrderCanceled(OrderCanceled $event)
    {
        $order = $event->order;

        try {
            if ($order->isDirty('status') && $order->getDirty()['status'] == Order::STATUS_CANCELED) {
                if (in_array($order->getOriginal('status'), [
                    Order::STATUS_PAID,
                    Order::STATUS_INVOICED,
                    Order::STATUS_SHIPPED,
                    Order::STATUS_COMPLETE
                ])) {
                    $order = $order->fresh();
                    $order->refunded = true;
                    $order->save();
                }
            }
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'SetRefund@onOrderCanceled'));
        }
    }
}
