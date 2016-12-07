<?php namespace Rastreio\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Rastreio\Events\RastreioSaved;
use Rastreio\Jobs\GetScreenshot;

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
}