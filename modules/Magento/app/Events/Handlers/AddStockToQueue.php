<?php namespace Magento\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\ProductStockUpdated;
use Core\Events\OrderProductCreated;
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
            ProductStockUpdated::class,
            '\Magento\Events\Handlers\AddStockToQueue@onProductStockUpdated'
        );
        
        $events->listen(
            OrderProductCreated::class,
            '\Magento\Events\Handlers\AddStockToQueue@onOrderProductCreated'
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
        \Log::debug('Handler AddStockToQueue/onProductStockUpdated acionado!', [$event->productStock]);
        dispatch(with(new SendStockInfo($event->productStock))->onQueue('high'));
    }
    

    /**
     * Handle the event.
     *
     * @param  OrderProductCreated  $event
     * @return void
     */
    public function onOrderProductCreated(OrderProductCreated $event)
    {
        $orderProduct = $event->orderProduct;
        $orderProduct = $orderProduct->fresh();
        $productStock = $orderProduct->productStock;
        
        if ($productStock && in_array((int)$orderProduct->pedido->status, [0,1])) {
            \Log::debug('Handler AddStockToQueue/onOrderProductCreated acionado!', [$productStock]);
            dispatch(with(new SendStockInfo($productStock))->onQueue('high'));
        }
    }
}
