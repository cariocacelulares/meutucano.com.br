<?php namespace Rastreio\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderPaid;
use Core\Http\Controllers\Pedido\FaturamentoCodigoController;
use Rastreio\Models\Rastreio;
use Rastreio\Jobs\SetDeadline;

class AttachRastreio
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
            '\Rastreio\Events\Handlers\AttachRastreio@onOrderPaid'
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

        if ($order->rastreios->count() < 1 && strtolower($order->marketplace) != 'mercadolivre') {
            Log::debug('Handler AttachRastreio/onOrderPaid acionado!', [$event]);

            $servico = \Config::get('rastreio.servico.' . strtolower($order->frete_metodo))
                ?: \Config::get('rastreio.servico.pac');
            $codigo = with(new FaturamentoCodigoController)->rawTrakingCode($servico);

            if ($codigo) {
                $rastreio = Rastreio::create([
                    'rastreio'   => $codigo,
                    'pedido_id'  => $order->id,
                    'data_envio' => date('Y-m-d'),
                    'servico'    => $order->frete_metodo,
                    'valor'      => $order->frete_valor,
                    'prazo'      => null,
                    'status'     => 0,
                ]);

                dispatch(with(new SetDeadline($rastreio))->onQueue('medium'));
            }
        }
    }
}
