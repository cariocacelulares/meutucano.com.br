<?php namespace Magento\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\OrderCanceled;
use Core\Events\OrderSent;
use Magento\Jobs\SendCancelInfo;
use Magento\Jobs\SendInvoiceInfo;

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
        // $events->listen(
        //     OrderCanceled::class,
        //     '\Magento\Events\Handlers\AddOrderToQueue@onOrderCanceled'
        // );
        //
        // $events->listen(
        //     OrderSent::class,
        //     '\Magento\Events\Handlers\AddOrderToQueue@onOrderSent'
        // );
    }

    /**
     * Handle the event.
     *
     * @param  OrderCanceled  $event
     * @return void
     */
    public function onOrderCanceled(OrderCanceled $event)
    {
        \Log::debug('Handler Magento\AddOrderToQueue@onOrderCanceled acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) == 'site') {
            dispatch(with(new SendCancelInfo($order))->onQueue('medium'));
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
        \Log::debug('Handler Magento\AddOrderToQueue@onOrderSent acionado!', [$event->order]);

        $order = $event->order;
        if (strtolower($order->marketplace) == 'site') {
            dispatch(with(new SendInvoiceInfo($order))->onQueue('high'));
        }
    }
}
