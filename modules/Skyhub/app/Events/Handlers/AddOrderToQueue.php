<?php namespace Skyhub\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\OrderCanceled;
use Core\Events\OrderDelivered;
use Core\Events\OrderSent;
use Skyhub\Jobs\SendCancelInfo;
use Skyhub\Jobs\SendDeliveredInfo;
use Skyhub\Jobs\SendInvoiceInfo;

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
            '\Skyhub\Events\Handlers\AddOrderToQueue@onOrderCanceled'
        );

        $events->listen(
            OrderDelivered::class,
            '\Skyhub\Events\Handlers\AddOrderToQueue@onOrderDelivered'
        );

        $events->listen(
            OrderSent::class,
            '\Skyhub\Events\Handlers\AddOrderToQueue@onOrderSent'
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
        \Log::debug('Handler Skyhub\AddOrderToQueue@onOrderCanceled acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) != 'site') {
            dispatch(with(new SendCancelInfo($order))->onQueue('medium'));
        }
    }

    /**
     * Handle the event.
     *
     * @param  OrderDelivered  $event
     * @return void
     */
    public function onOrderDelivered(OrderDelivered $event)
    {
        \Log::debug('Handler Skyhub\AddOrderToQueue@onOrderDelivered acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) != 'site') {
            dispatch(with(new SendDeliveredInfo($order))->onQueue('medium'));
        }
    }

    /**
     * Handle the event.
     *
     * @param  OrderSent  $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        \Log::debug('Handler Skyhub\AddOrderToQueue@onOrderSent acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) != 'site') {
            dispatch(with(new SendInvoiceInfo($order))->onQueue('high'));
        }
    }
}
