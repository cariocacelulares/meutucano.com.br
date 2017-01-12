<?php namespace InspecaoTecnica\Events\Handlers;

use Core\Events\OrderCanceled;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use InspecaoTecnica\Models\InspecaoTecnica;

class DeleteInspecaoTecnica
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
            '\InspecaoTecnica\Events\Handlers\DeleteInspecaoTecnica@onOrderCanceled'
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
        $order = $event->order;
        $order = $order->fresh();
        Log::debug('Handler DeleteInspecaoTecnica/onOrderCanceled acionado.', [$event]);

        // Cada produto do pedido
        foreach ($order->produtos as $orderProduct) {
            $qty = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)->delete();
            Log::notice($qty . ' inspecoes tecnica foram excluidas', [$qty, $orderProduct]);
        }
    }
}
