<?php namespace Modules\Magento\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Modules\Core\Events\ProductStockChange;
use Modules\Magento\Http\Controllers\MagentoController;

class SendProductToQueue
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
            '\Modules\Magento\Events\Handlers\SendProductToQueue@onProductStockChange'
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
        \Log::debug('Listener SendProductToQueue ativado produto: ' . $event->produto_sku);
        with(new MagentoController(false))->sendProductToQueue($event->produto_sku);
    }
}