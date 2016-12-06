<?php namespace Magento\Events\Handlers;

use Core\Events\ProductStockChange;
use Illuminate\Events\Dispatcher;
use Magento\Jobs\SendStockInfo;

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
            ProductStockChange::class,
            '\Magento\Events\Handlers\AddStockToQueue@onProductStockChange'
        );
    }

    /**
     * Handle the event.
     *
     * @param  ProductStockChange  $event
     * @return void
     */
    public function onProductStockChange(ProductStockChange $event)
    {
        \Log::debug('Handler AddStockToQueue acionado!', [$event->product]);
        dispatch(with(new SendStockInfo($event->product))->onQueue('magentoStock'));
    }
}