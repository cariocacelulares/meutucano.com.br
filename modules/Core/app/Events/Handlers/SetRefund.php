<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderCanceled;

class SetRefund
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
            '\Core\Events\Handlers\SetRefund@onOrderCanceled'
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
        Log::debug('Handler SetRefund/onOrderCanceled acionado!', [$event]);

        try {
            $order = $event->order;

            if (!$order) {
                Log::debug('Pedido não encontrado!', [$order]);
            } else {
                $dirty = $order->getDirty();
                // If status has updated
                if (isset($dirty['status'])) {
                    // If old status is sent, paid or delivered
                    if (in_array((int)$order->getOriginal('status'), [1, 2, 3])) {
                        $order = $order->fresh();
                        $order->reembolso = true;
                        if ($order->save()) {
                            Log::notice("Pedido {$order->id} marcado como reembolso!", [$order]);
                        } else {
                            Log::notice("Falha ao tentar marcar o pedido {$order->id} como reembolso!", [$order]);
                        }
                    }
                }
            }
        } catch (\Exception $exception) {
            Log::warning('Ocorreu um erro ao marcar o pedido como reembolso (OrderCanceled/SetRefund/onOrderCanceled)', [$order]);
            reportError('Ocorreu um erro ao marcar o pedido como reembolso: ' . $exception->getMessage() . ' - ' . $exception->getLine() . ' - ' . (isset($order->id) ? $order->id : ''));
        }
    }
}
