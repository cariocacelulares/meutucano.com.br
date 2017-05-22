<?php namespace Magento\Events\Handlers;

use Core\Events\ProductPriceUpdated;
use Illuminate\Events\Dispatcher;
use Magento\Jobs\SendPriceInfo;

class AddPriceToQueue
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        // $events->listen(
        //     ProductPriceUpdated::class,
        //     '\Magento\Events\Handlers\AddPriceToQueue@onProductPriceUpdated'
        // );
    }

    /**
     * Handle the event.
     *
     * @param  ProductPriceUpdated  $event
     * @return void
     */
    public function onProductPriceUpdated(ProductPriceUpdated $event)
    {
        \Log::debug('Handler AddPriceToQueue acionado!', [$event->product]);
        dispatch(with(new SendPriceInfo($event->product))->onQueue('high'));
    }
}
