<?php namespace InspecaoTecnica\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderCanceled;
use Core\Events\OrderProductDeleting;
use Core\Events\OrderProductQtyDecreased;
use Core\Models\Pedido\PedidoProduto;
use InspecaoTecnica\Http\Controllers\InspecaoTecnicaController;

class DetachInspecaoTecnica
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
            OrderProductQtyDecreased::class,
            '\InspecaoTecnica\Events\Handlers\DetachInspecaoTecnica@onOrderProductQtyDecreased'
        );

        $events->listen(
            OrderProductDeleting::class,
            '\InspecaoTecnica\Events\Handlers\DetachInspecaoTecnica@onOrderProductDeleting'
        );

        $events->listen(
            OrderCanceled::class,
            '\InspecaoTecnica\Events\Handlers\DetachInspecaoTecnica@onOrderCanceled'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductQtyDecreased  $event
     * @return void
     */
    public function onOrderProductQtyDecreased(OrderProductQtyDecreased $event)
    {
        $orderProduct = $event->orderProduct;
        $qty          = $event->qty;
        $orderProduct = $orderProduct->fresh();

        // Apenas se o produto for pago, enviado ou entregue
        if (in_array((int)$orderProduct->pedido->status, [1, 2, 3])) {
            Log::debug('Handler DetachInspecaoTecnica/OrderProductQtyDecreased acionado.', [$event]);
            for ($i=0; $i < $qty; $i++) {
                with(new InspecaoTecnicaController())->detachInspecao($orderProduct);
            }
        }
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductDeleting  $event
     * @return void
     */
    public function onOrderProductDeleting(OrderProductDeleting $event)
    {
        $orderProduct = $event->orderProduct;
        $orderProduct = $orderProduct->fresh();

        // Apenas se o produto for pago, enviado ou entregue
        if (in_array((int)$orderProduct->pedido->status, [1, 2, 3])) {
            Log::debug('Handler DetachInspecaoTecnica/OrderProductDeleting acionado.', [$event]);
            $this->detachInspecao($orderProduct, true);
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
        $order = $event->order;
        $order = $order->fresh();
        Log::debug('Handler DeleteInspecaoTecnica/onOrderCanceled acionado.', [$event]);

        // Cada produto do pedido
        foreach ($order->produtos as $orderProduct) {
            $this->detachInspecao($orderProduct, true);
        }
    }

    /**
     * Relaciona uma inspecao tecnica com o pedido produto
     *
     * @param  PedidoProduto $orderProduct
     * @return void
     */
    public function detachInspecao(PedidoProduto $orderProduct, $onlyReviewed = false)
    {
        $product = $orderProduct->produto;

        Log::debug('Tentando desrelacionar pedido produto e inspecao tecnica.');
        with(new InspecaoTecnicaController())->detachInspecao($orderProduct, $onlyReviewed);
    }
}
