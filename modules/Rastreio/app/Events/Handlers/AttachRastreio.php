<?php namespace Rastreio\Events\Handlers;

use Core\Events\OrderPaid;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Rastreio\Events\RastreioSaved;
use Rastreio\Jobs\GetScreenshot;
use Rastreio\Jobs\SetDeadline;
use Rastreio\Models\Rastreio;

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

        if (!$order->rastreios && strtolower($order->marketplace) != 'mercadolivre') {
            Log::debug('Handler AttachRastreio/onOrderPaid acionado!', [$event]);

            // 0 - PAC / 1 - SEDEX
            $servicos = (strtolower($order->frete_metodo) == 'sedex') ? 1 : 0;
            $codigo = with(new FaturamentoCodigoController)->generateCode($servico);

            $rastreio = Rastreio::create([
                'rastreio' => $codigo,
                'pedido_id' => $order->id,
                'data_envio' => date('Y-m-d'),
                'servico' => $order->frete_metodo,
                'valor' => $order->frete_valor,
                'prazo' => null,
                'status' => 0,
            ]);

            with(new RastreioController)->setDeadline($rastreio);
        }
    }
}
