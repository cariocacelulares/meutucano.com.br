<?php namespace Core\Events\Handlers;

use Core\Models\Product;
use Core\Events\OrderSent;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

class SetProductSerialCost
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
            OrderSent::class,
            '\Core\Events\Handlers\SetProductSerialCost@onOrderSent'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderSent $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        Log::debug('Handler SetProductSerialCost/onOrderSent acionado!', [$event]);
        $order = $event->order;

        try {
            foreach ($order->products as $orderProduct) {
                $productSerial = $orderProduct->productSerial;

                if ($productSerial) {
                    $productSerial->cost = $orderProduct->product->cost;
                    $productSerial->save();
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao calcular o custo dos seriais'), [$order->toArray()]);
        }
    }
}
