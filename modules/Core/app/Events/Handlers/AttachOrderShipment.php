<?php namespace Core\Events\Handlers;

use Core\Events\OrderPaid;
use Core\Jobs\SetDeadline;
use Core\Models\OrderShipment;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Http\Controllers\Pedido\FaturamentoCodigoController;

class AttachOrderShipment
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
            OrderPaid::class,
            '\Core\Events\Handlers\AttachOrderShipment@onOrderPaid'
        );
    }

    /**
     * Handle the event.
     *
     * @param  onOrderPaid  $event
     * @return void
     */
    public function onOrderPaid(OrderPaid $event)
    {
        $order = $event->order;

        if ($order->shipments->count() < 1 && strtolower($order->marketplace) != 'mercadolivre') {
            // Log::debug('Handler AttachOrderShipment/onOrderPaid acionado!', [$event]);
            //
            // $servico = \Config::get('rastreio.servico.' . strtolower($order->frete_metodo))
            //     ?: \Config::get('rastreio.servico.pac');
            // $codigo = with(new FaturamentoCodigoController)->rawTrakingCode($servico);
            //
            // if ($codigo) {
            //     $rastreio = OrderShipment::create([
            //         'rastreio'   => $codigo,
            //         'pedido_id'  => $order->id,
            //         'data_envio' => date('Y-m-d'),
            //         'servico'    => $order->frete_metodo,
            //         'valor'      => $order->frete_valor,
            //         'prazo'      => null,
            //         'status'     => 0,
            //     ]);
            //
            //     dispatch(with(new SetDeadline($rastreio))->onQueue('medium'));
            // }
        }
    }
}
