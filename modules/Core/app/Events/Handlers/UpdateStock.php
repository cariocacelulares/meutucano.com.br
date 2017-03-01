<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductImeiCreated;
use Core\Events\ProductImeiDeleted;
use Core\Events\OrderSent;
use Core\Events\OrderProductCreated;
use Core\Events\OrderCanceled;


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
            ProductImeiDeleted::class,
            '\Core\Events\Handlers\UpdateStock@onProductImeiDeleted'
        );

        $events->listen(
            ProductImeiCreated::class,
            '\Core\Events\Handlers\UpdateStock@onProductImeiCreated'
        );

        $events->listen(
            OrderSent::class,
            '\Core\Events\Handlers\UpdateStock@onOrderSent'
        );

        // Aqui foi criado uma redundancia pois quando o produto é criado já com status pago ele ainda não possui pedido produto
        $events->listen(
            OrderProductCreated::class,
            '\Core\Events\Handlers\UpdateStock@onOrderProductCreated'
        );

        $events->listen(
            OrderCanceled::class,
            '\Core\Events\Handlers\UpdateStock@onOrderCanceled'
        );
    }

    /**
     * Trigger stock updates on product imei created
     *
     * @param  ProductImeiCreated $event
     * @return void
     */
    public function onProductImeiCreated(ProductImeiCreated $event)
    {
        Log::debug('Handler UpdateStock/onProductImeiCreated acionado!', [$event]);

        if ($productImei = $event->productImei) {
            \Stock::add(
                $productImei->productStock->product_sku,
                1,
                $productImei->productStock->stock_slug
            );
        } else {
            Log::warning('ProductImei não encontrado!', [$productImei]);
        }
    }

    /**
     * Trigger stock updates on product imei deleted
     *
     * @param  ProductImeiDeleted $event
     * @return void
     */
    public function onProductImeiDeleted(ProductImeiDeleted $event)
    {
        Log::debug('Handler UpdateStock/onProductImeiDeleted acionado!', [$event]);

        if ($productImei = $event->productImei) {
            \Stock::substract(
                $productImei->productStock->product_sku,
                1,
                $productImei->productStock->stock_slug
            );
        } else {
            Log::warning('ProductImei não encontrado!', [$productImei]);
        }
    }

    /**
     * Trigger stock updates when order sent
     *
     * @param  OrderSent  $event
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
            foreach ($order->produtos as $orderProduct) {
                $stock = \Stock::choose($orderProduct->produto_sku);
                \Stock::substract($orderProduct->produto_sku, 1, $stock);
            }
        }
    }

    /**
     * Trigger stock updates when order canceled
     *
     * @param  OrderProductCreated  $event
     * @return void
     */
    public function onOrderProductCreated(OrderProductCreated $event)
    {
        $orderProduct = $event->orderProduct;
        $orderProduct = $orderProduct->fresh();

        // Apenas se o produto for enviado ou entregue
        if (in_array((int)$orderProduct->pedido->status, [2, 3])) {
            Log::debug('Handler UpdateStock/onOrderProductCreated acionado.', [$event]);

            $stock = \Stock::choose($orderProduct->produto_sku);
            \Stock::substract($orderProduct->produto_sku, 1, $stock);
        }
    }

    /**
     * Trigger stock updates when order canceled
     *
     * @param  OrderCanceled  $event
     * @return void
     */
    public function onOrderCanceled(OrderCanceled $event)
    {
        Log::debug('Handler UpdateStock/onOrderCanceled acionado!', [$event]);

        $order = $event->order;
        $order = $order->fresh();

        if (!$order) {
            Log::debug('Pedido não encontrado!', [$order]);
        } else {
            foreach ($order->produtos as $orderProduct) {
                $stock = \Stock::choose($orderProduct->produto_sku);
                \Stock::add($orderProduct->produto_sku, 1, $stock);
            }
        }
    }
}
