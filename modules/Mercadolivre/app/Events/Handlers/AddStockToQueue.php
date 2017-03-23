<?php namespace Mercadolivre\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\ProductStockUpdated;
use Mercadolivre\Jobs\SendStockInfo;

class AddStockToQueue
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
            ProductStockUpdated::class,
            '\Mercadolivre\Events\Handlers\AddStockToQueue@onProductStockUpdated'
        );
    }

    /**
     * Handle the event.
     *
     * @param  ProductStockUpdated  $event
     * @return void
     */
    public function onProductStockUpdated(ProductStockUpdated $event)
    {
        \Log::debug('Handler Mercadolivre:AddStockToQueue acionado!', [$event->product]);
        dispatch(with(new SendStockInfo($event->product))->onQueue('high'));
    }
}
