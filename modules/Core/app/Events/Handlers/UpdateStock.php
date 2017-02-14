<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductImeiCreated;
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

        /*$events->listen(
            OrderProductCreated::class,
            '\Core\Events\Handlers\UpdateStock@onOrderProductCreated'
        );

        $events->listen(
            OrderProductUpdated::class,
            '\Core\Events\Handlers\UpdateStock@onOrderProductUpdated'
        );

        $events->listen(
            OrderCanceled::class,
            '\Core\Events\Handlers\UpdateStock@onOrderCanceled'
        );*/
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

    /**
     * Trigger stock updates on order product created
     *
     * @param  OrderProductCreated  $event
     * @return void
     */
    /*public function onOrderProductCreated(OrderProductCreated $event)
    {
        Log::debug('Handler UpdateStock/onOrderProductCreated acionado!', [$event]);
        $orderProduct = $event->orderProduct;
        $order        = $orderProduct->pedido;

        if (!$orderProduct) {
            Log::debug('PedidoProduto não encontrado!', [$orderProduct]);
        } elseif ((int)$order->status !== 5) {
            $this->updateStock($orderProduct->produto, $orderProduct->quantidade);
        }
    }*/

    /**
     * Trigger stock updates on order product updated
     *
     * @param  OrderProductUpdated  $event
     * @return void
     */
    /*public function onOrderProductUpdated(OrderProductUpdated $event)
    {
        Log::debug('Handler UpdateStock/onOrderProductUpdated acionado!', [$event]);

        try {
            $orderProduct = $event->orderProduct;
            $order        = $orderProduct->pedido;

            if (!$orderProduct) {
                Log::debug('PedidoProduto não encontrado!', [$orderProduct]);
            } elseif ((int)$order->status != 5) {
                $dirty = $orderProduct->getDirty();

                // Se a quantidade foi alterada, pega a diferença e retira ou adiciona ao estoque
                if (isset($dirty['quantidade'])) {
                    $this->updateStock($orderProduct->produto, ($orderProduct->quantidade - $orderProduct->getOriginal('quantidade')));
                }

                // Se o produto foi alterado, altera o estoque do novo e do antigo
                if (isset($dirty['product_sku'])) {
                    $this->updateStock($orderProduct->produto, $orderProduct->quantidade);

                    if ($oldProduct = Produto::find($orderProduct->getOriginal('product_sku'))) {
                        $this->updateStock($oldProduct, ($orderProduct->getOriginal('quantidade') ? $orderProduct->getOriginal('quantidade') : $orderProduct->quantidade));
                    }
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Ocorreu um erro ao tentar diminuir o estoque no tucano (OrderSaved/UpdateStock/onOrderSaved)', [$orderProduct]));
            reportError('Ocorreu um erro ao tentar diminuir o estoque no tucano: ' . $exception->getMessage() . ' - ' . $exception->getLine() . ' - ' . (isset($product->sku) ? $product->sku : ''));
        }
    }*/

    /**
     * Trigger stock updates when order canceled
     *
     * @param  OrderCanceled  $event
     * @return void
     */
    /*public function onOrderCanceled(OrderCanceled $event)
    {
        Log::debug('Handler UpdateStock/onOrderCanceled acionado!', [$event]);

        try {
            $order = $event->order;
            $order = $order->fresh();

            if (!$order) {
                Log::debug('Pedido não encontrado!', [$order]);
            } else {
                foreach ($order->produtos as $orderProduct) {
                    $this->updateStock($orderProduct->produto, $orderProduct->quantidade, true);
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Ocorreu um erro ao tentar acrescentar o estoque no tucano (OrderCanceled/UpdateStock/onOrderCanceled)', [$order]));
            reportError('Ocorreu um erro ao tentar acrescentar o estoque no tucano: ' . $exception->getMessage() . ' - ' . $exception->getLine() . ' - ' . (isset($produto->sku) ? $produto->sku : ''));
        }
    }*/

    /**
     * Update stock from product
     *
     * @param  Product $product
     * @param  int    $qty
     * @param  bool $sum
     * @return void
     */
    /*public function updateStock($product, int $qty, bool $sum = null)
    {
        if (!$product) {
            return null;
        }

        try {
            $qty = ($sum) ? ($qty * -1) : $qty;

            $currentStock     = $product->estoque;
            $product->estoque = ($currentStock - $qty);

            if ($product->save()) {
                Log::notice("Estoque do produto {$product->sku} alterado de {$currentStock} para {$product->estoque}", [$product]);
            } else {
                Log::warning('Não foi possível alterar o estoque do produto no tucano: ' . $product->sku, [$product]);
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Ocorreu um erro ao tentar alterar o estoque no tucano (OrderCanceled/UpdateStock)', [$product]));
            reportError('Ocorreu um erro ao tentar alterar o estoque no tucano: ' . $exception->getMessage() . ' - ' . $exception->getLine() . ' - ' . (isset($product->sku) ? $product->sku : ''));
        }
    }*/
}
