<?php namespace InspecaoTecnica\Events\Handlers;

use Core\Events\OrderPaid;
use Core\Events\OrderProductCreated;
use Core\Models\Pedido\Pedido;
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
        // Aqui foi criado uma redundancia pois quando o produto é criado já com status pago
        // ele ainda não possui pedido produto

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
        Log::debug('Handler AttachInspecaoTecnica/onOrderPaid acionado.', [$event]);

        $this->attachInspecaoTecnica($order);
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
        Log::debug('Handler AttachInspecaoTecnica/onOrderProductCreated acionado.', [$event]);

        $this->attachInspecaoTecnica($orderProduct->pedido);
    }

    public function attachInspecaoTecnica(Pedido $order)
    {
        // Cada produto do pedido
        foreach ($order->produtos as $orderProduct) {
            $product = $orderProduct->produto;

            // Se não for seminovo para
            if ((int)$product->estado !== 1) {
                return;
            }

            for ($i=0; $i < $orderProduct->quantidade; $i++) {
                Log::debug('Tentando relacionado pedido produto e inspecao tecnica.');
                with(new InspecaoTecnicaController())->attachInspecao($orderProduct);
            }
        }
    }
}