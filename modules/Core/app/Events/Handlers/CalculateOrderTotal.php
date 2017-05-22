<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\OrderProductSaved;
use Illuminate\Support\Facades\Log;

class CalculateOrderTotal
{
    /**
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderProductSaved::class,
            '\Core\Events\Handlers\CalculateOrderTotal@onProductSaved'
        );
    }

    /**
     * Handle the event.
     *
     * @param  onProductSaved  $event
     * @return void
     */
    public function onProductSaved(OrderProductSaved $event)
    {
        $order = $event->orderProduct->order;

        try {
            $orderTotal = $order->orderProducts->sum('price');

            $order->total = $orderTotal + $order->taxes - $order->discount;
            $order->save();
        } catch (\Exception $e) {
            Log::warning('CalculateOrderTotal@onProductSaved', [$event->orderProduct]);
        }
    }
}
