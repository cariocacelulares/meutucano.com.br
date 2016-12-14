<?php namespace Core\Events\Handlers;

use Core\Events\OrderCanceled;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductUpdated;
use Core\Events\OrderSaved;
use Core\Models\Produto\Produto;
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
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductCreated  $event
     * @return void
     */
    public function onOrderProductCreated(OrderProductCreated $event)
    {
        Log::debug('Handler UpdateStock/onOrderProductCreated acionado!', [$event]);
        $orderProduct = $event->orderProduct;
        $order = $orderProduct->pedido;

        if (!$orderProduct) {
            Log::debug('PedidoProduto não encontrado!', [$orderProduct]);
        } else if ((int)$order->status !== 5) {
            $this->updateStock($orderProduct->produto, $orderProduct->quantidade);
        }
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductUpdated  $event
     * @return void
     */
    public function onOrderProductUpdated(OrderProductUpdated $event)
    {
        Log::debug('Handler UpdateStock/onOrderProductUpdated acionado!', [$event]);

        try {
            $orderProduct = $event->orderProduct;
            $order = $orderProduct->pedido;

            if (!$orderProduct) {
                Log::debug('PedidoProduto não encontrado!', [$orderProduct]);
            } else if ((int)$order->status != 5) {
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
    }

    /**
     * Handle the event.
     *
     * @param  OrderCanceled  $event
     * @return void
     */
    public function onOrderCanceled(OrderCanceled $event)
    {
        Log::debug('Handler UpdateStock/onOrderCanceled acionado!', [$event]);

        try {
            $order = $event->order;

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
    }

    public function updateStock($product, int $qty, bool $sum = false)
    {
        if (!$product) {
            return null;
        }

        try {
            $qty = ($sum) ? ($qty * -1) : $qty;

            $currentStock = $product->estoque;
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
    }
}