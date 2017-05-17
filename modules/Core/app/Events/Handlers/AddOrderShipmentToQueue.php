<?php namespace Core\Events\Handlers;

use Core\Events\OrderSent;
use Core\Jobs\SetDeadline;
use Core\Models\OrderShipment;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderShipmentSaved;

class AddOrderShipmentToQueue
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
            OrderShipmentSaved::class,
            '\Core\Events\Handlers\AddOrderShipmentToQueue@onOrderShipmentSaved'
        );

        $events->listen(
            OrderSent::class,
            '\Core\Events\Handlers\AddOrderShipmentToQueue@onOrderSent'
        );
    }

    /**
     * Handle the event.
     *
     * @param  onOrderSent  $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        $order         = $event->order;
        $orderShipment = (isset($order->shipments[0])) ? $order->shipments[0] : null;

        if (!is_null($orderShipment)) {
            Log::debug('Handler AddOrderShipmentToQueue/onOrderSent acionado!', [$event]);
            dispatch(with(new SetDeadline($orderShipment))->onQueue('medium'));
        }
    }
}
