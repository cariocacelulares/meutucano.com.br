<?php namespace Magento\Events\Handlers;

use Core\Events\OrderCanceled;
use Illuminate\Events\Dispatcher;
use Magento\Jobs\SendCancelInfo;

class AddOrderToQueue
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderCanceled::class,
            '\Magento\Events\Handlers\AddOrderToQueue@onOrderCanceled'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderCanceled  $event
     * @return void
     */
    public function onOrderCanceled(OrderCanceled $event)
    {
        \Log::debug('Handler AddOrderToQueue acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) == 'site') {
            dispatch(with(new SendCancelInfo($order))->onQueue('high'));
        }
    }
}