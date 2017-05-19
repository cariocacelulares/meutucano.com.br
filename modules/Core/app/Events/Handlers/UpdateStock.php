<?php namespace Core\Events\Handlers;

use Core\Events\OrderSent;
use Core\Events\OrderCanceled;
use Core\Events\OrderProductCreated;
use Core\Events\ProductSerialCreated;
use Core\Events\ProductSerialDeleted;
use Core\Events\ProductSerialRestored;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

class UpdateStock
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
            ProductSerialRestored::class,
            '\Core\Events\Handlers\UpdateStock@onProductSerialRestored'
        );

        $events->listen(
            ProductSerialDeleted::class,
            '\Core\Events\Handlers\UpdateStock@onProductSerialDeleted'
        );

        $events->listen(
            ProductSerialCreated::class,
            '\Core\Events\Handlers\UpdateStock@onProductSerialCreated'
        );

        $events->listen(
            OrderSent::class,
            '\Core\Events\Handlers\UpdateStock@onOrderSent'
        );

        $events->listen(
            OrderProductCreated::class,
            '\Core\Events\Handlers\UpdateStock@onOrderProductCreated'
        );
    }

    /**
     * Trigger stock updates on product serial created
     *
     * @param  ProductSerialCreated $event
     * @return void
     */
    public function onProductSerialCreated(ProductSerialCreated $event)
    {
        Log::debug('Handler UpdateStock/onProductSerialCreated acionado!', [$event]);

        if ($productSerial = $event->productSerial) {
            \Stock::add(
                $productSerial->depotProduct->product_sku,
                1,
                $productSerial->depotProduct->stock_slug
            );
        } else {
            Log::warning('ProductSerial não encontrado!', [$productSerial]);
        }
    }

    /**
     * Trigger stock updates on product serial restored
     *
     * @param  ProductSerialRestored $event
     * @return void
     */
    public function onProductSerialRestored(ProductSerialRestored $event)
    {
        Log::debug('Handler UpdateStock/onProductSerialRestored acionado!', [$event]);

        if ($productSerial = $event->productSerial) {
            \Stock::add(
                $productSerial->depotProduct->product_sku,
                1,
                $productSerial->depotProduct->stock_slug
            );
        } else {
            Log::warning('ProductSerial não encontrado!', [$productSerial]);
        }
    }

    /**
     * Trigger stock updates on product serial deleted
     *
     * @param  ProductSerialDeleted $event
     * @return void
     */
    public function onProductSerialDeleted(ProductSerialDeleted $event)
    {
        Log::debug('Handler UpdateStock/onProductSerialDeleted acionado!', [$event]);

        if ($productSerial = $event->productSerial) {
            \Stock::substract(
                $productSerial->depotProduct->product_sku,
                1,
                $productSerial->depotProduct->stock_slug
            );
        } else {
            Log::warning('ProductSerial não encontrado!', [$productSerial]);
        }
    }

    /**
     * Trigger stock updates when order sent
     *
     * @param  OrderSent $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        Log::debug('Handler UpdateStock/onOrderSent acionado!', [$event]);

        $order = $event->order;
        $order = $order->fresh();

        if (!$order) {
            Log::debug('Pedido não encontrado!', [$order]);
        } else {
            foreach ($order->products as $orderProduct) {
                $stock = \Stock::choose($orderProduct->product_sku);
                \Stock::substract($orderProduct->product_sku, 1, $stock);
            }
        }
    }

    /**
     * Trigger stock updates when order product is created
     *
     * @param  OrderProductCreated  $event
     * @return void
     */
    public function onOrderProductCreated(OrderProductCreated $event)
    {
        $orderProduct = $event->orderProduct;
        $orderProduct = $orderProduct->fresh();

        if ($orderProduct->order->count_on_stock) {
            Log::debug('Handler UpdateStock/onOrderProductCreated acionado.', [$event]);

            $depot = \Stock::choose($orderProduct->product_sku);
            \Stock::substract($orderProduct->product_sku, 1, $depot);
        }
    }
}
