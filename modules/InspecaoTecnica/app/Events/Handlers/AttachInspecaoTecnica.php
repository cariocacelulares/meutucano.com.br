<?php namespace InspecaoTecnica\Events\Handlers;

use Core\Events\OrderPaid;
use Core\Events\OrderProductCreated;
use Core\Events\OrderProductQtyIncreased;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use InspecaoTecnica\Http\Controllers\InspecaoTecnicaController;
use InspecaoTecnica\Models\InspecaoTecnica;

class AttachInspecaoTecnica
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        // Aqui foi criado uma redundancia pois quando o produto é criado já com status pago ele ainda não possui pedido produto
        $events->listen(
            OrderProductCreated::class,
            '\InspecaoTecnica\Events\Handlers\AttachInspecaoTecnica@onOrderProductCreated'
        );

        $events->listen(
            OrderPaid::class,
            '\InspecaoTecnica\Events\Handlers\AttachInspecaoTecnica@onOrderPaid'
        );
        // ########

        $events->listen(
            OrderProductQtyIncreased::class,
            '\InspecaoTecnica\Events\Handlers\AttachInspecaoTecnica@onOrderProductQtyIncreased'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderPaid  $event
     * @return void
     */
    public function onOrderPaid(OrderPaid $event)
    {
        $order = $event->order;
        $order = $order->fresh();

        if (!$order->wasRecentlyCreated) {
            Log::debug('Handler AttachInspecaoTecnica/onOrderPaid acionado.', [$event]);

            // Cada produto do pedido
            foreach ($order->produtos as $orderProduct) {
                $this->attachInspecaoTecnica($orderProduct);
            }
        }
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

        if ((int)$orderProduct->pedido->status === 1) {
            Log::debug('Handler AttachInspecaoTecnica/onOrderProductCreated acionado.', [$event]);
            $this->attachInspecaoTecnica($orderProduct);
        }
    }

    /**
     * Handle the event.
     *
     * @param  OrderProductQtyIncreased  $event
     * @return void
     */
    public function onOrderProductQtyIncreased(OrderProductQtyIncreased $event)
    {
        $orderProduct = $event->orderProduct;
        $qty          = $event->qty;
        $orderProduct = $orderProduct->fresh();

        Log::debug('Handler AttachInspecaoTecnica/onOrderProductQtyIncreased acionado.', [$event]);
        for ($i=0; $i < $qty; $i++) {
            with(new InspecaoTecnicaController())->attachInspecao($orderProduct);
        }
    }

    /**
     * Relaciona uma inspecao tecnica com o pedido produto
     *
     * @param  PedidoProduto $orderProduct
     * @return void
     */
    public function attachInspecaoTecnica(PedidoProduto $orderProduct)
    {
        $product = $orderProduct->produto;

        // Se não for seminovo para
        if ((int)$product->estado !== 1) {
            return;
        }

        for ($i=0; $i < $orderProduct->quantidade; $i++) {
            Log::debug('Tentando relacionar pedido produto e inspecao tecnica.');
            with(new InspecaoTecnicaController())->attachInspecao($orderProduct);
        }
    }
}