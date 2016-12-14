<?php namespace Rastreio\Events\Handlers;

use Core\Events\OrderSent;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Rastreio\Events\RastreioSaved;
use Rastreio\Jobs\GetScreenshot;
use Rastreio\Jobs\SetDeadline;
use Rastreio\Models\Rastreio;

class AddRastreioToQueue
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
            RastreioSaved::class,
            '\Rastreio\Events\Handlers\AddRastreioToQueue@onRastreioSaved'
        );

        $events->listen(
            OrderSent::class,
            '\Rastreio\Events\Handlers\AddRastreioToQueue@onOrderSent'
        );
    }

    /**
     * Handle the event.
     *
     * @param  RastreioSaved  $event
     * @return void
     */
    public function onRastreioSaved(RastreioSaved $event)
    {
        Log::debug('Handler AddRastreioToQueue/onRastreioSaved acionado!', [$event]);

        $rastreio = $event->rastreio;
        $oldStatus = ($rastreio->getOriginal('status') === null) ? null : (int) $rastreio->getOriginal('status');
        $newStatus = ($rastreio->status === null) ? null : (int) $rastreio->status;

        if ($newStatus !== $oldStatus && in_array($newStatus, [3, 4, 5, 6])) {
            dispatch(with(new GetScreenshot($rastreio))->onQueue('low'));
        }
    }

    /**
     * Handle the event.
     *
     * @param  onOrderSent  $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        $order = $event->order;
        $rastreio = (isset($order->rastreios[0])) ? $order->rastreios[0] : null;

        if (!is_null($rastreio)) {
            Log::debug('Handler AddRastreioToQueue/onOrderSent acionado!', [$event]);
            dispatch(with(new SetDeadline($rastreio))->onQueue('medium'));
        }
    }
}