<?php namespace Core\Events\Handlers;

use Core\Events\OrderPaid;
use Core\Models\OrderShipment;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

class AttachOrderShipment
{
    /**
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderPaid::class,
            '\Core\Events\Handlers\AttachOrderShipment@onOrderPaid'
        );
    }

    /**
     * Handle the event.
     *
     * @param  onOrderPaid  $event
     * @return void
     */
    public function onOrderPaid(OrderPaid $event)
    {
        $order = $event->order;

        try {
            if ($order->shipments->count() === 0) {
                $order->shipments()->save(new OrderShipment([
                    'shipment_method_slug' => $order->shipment_method_slug,
                    'cost'                 => $order->shipment_cost,
                ]));
            }
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'AttachOrderShipment@onOrderPaid'));
        }
    }
}
