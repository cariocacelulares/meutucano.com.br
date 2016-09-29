<?php namespace App\Listeners;

use App\Events\OrderCancel;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Pedido\Pedido;
use App\Http\Controllers\Integracao\MagentoController;
use App\Http\Controllers\Integracao\SkyhubController;

class SendCancelInfo
{
    /**
     * Handle the event.
     *
     * @param  OrderCancel  $event
     * @return void
     */
    public function handle(OrderCancel $event)
    {
        $pedido = $event->order;
        \Log::debug('Listener SendCancelInfo ativado. pedido: ' . $pedido->id);

        if (strtolower($pedido->marketplace) == 'site') {
            with(new MagentoController())->cancelOrder($pedido);
        } else {
            with(new SkyhubController())->cancelOrder($pedido);
        }
    }
}