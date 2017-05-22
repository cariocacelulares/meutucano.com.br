<?php namespace Core\Events\Handlers;

use Core\Events\OrderInvoiced;
use Core\Models\OrderShipment;
use Core\Jobs\CalculateDeadline;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

class AddOrderShipmentToQueue
{
    /**
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderInvoiced::class,
            '\Core\Events\Handlers\AddOrderShipmentToQueue@onOrderInvoiced'
        );
    }

    /**
     * @param  onOrderInvoiced  $event
     * @return void
     */
    public function onOrderInvoiced(OrderInvoiced $event)
    {
        $order = $event->order;

        if ($orderShipment = $order->shipments()->first()) {
            dispatch(with(new CalculateDeadline($orderShipment))->onQueue('medium'));
        }
    }
}
