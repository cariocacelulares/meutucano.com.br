<?php namespace InspecaoTecnica\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderPaid;
use Core\Events\OrderProductCreated;
use Core\Models\Pedido\PedidoProduto;
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

        // Apenas se o produto for pago, enviado ou entregue
        if (in_array((int)$orderProduct->pedido->status, [1, 2, 3])) {
            Log::debug('Handler AttachInspecaoTecnica/onOrderProductCreated acionado.', [$event]);
            $this->attachInspecaoTecnica($orderProduct);
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

        Log::debug('Tentando relacionar pedido produto e inspecao tecnica.');
        with(new InspecaoTecnicaController())->attachInspecao($orderProduct);
    }
}
