<?php namespace Core\Events\Handlers;

use Core\Models\Order;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderInvoiceCreated;

class InvoiceOrder
{
    /**
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            OrderInvoiceCreated::class,
            '\Core\Events\Handlers\InvoiceOrder@onOrderInvoiceCreated'
        );
    }

    /**
     * Handle the event.
     *
     * @param  onOrderInvoiceCreated  $event
     * @return void
     */
    public function onOrderInvoiceCreated(OrderInvoiceCreated $event)
    {
        $order = $event->orderInvoice->order;

        try {
            $order->status = Order::STATUS_INVOICED;
            $order->save();
        } catch (\Exception $e) {
            Log::warning(logMessage($e, 'InvoiceOrder@onOrderInvoiceCreated'));
        }
    }
}
