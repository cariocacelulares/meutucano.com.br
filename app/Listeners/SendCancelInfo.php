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
        $user_id = $event->user_id;
        \Log::debug('Listener SendCancelInfo ativado. pedido: ' . $pedido->id);

        if (strtolower($pedido->marketplace) == 'site') {
            with(new MagentoController())->cancelOrder($pedido);
        } else {
            if ($user_id === false) {
                \Log::debug('Nenhuma informação de cancelamento foi enviada, pois não existe usuário logado!');
            } else {
                \Log::debug('Cancela na skyhub');
                with(new SkyhubController())->cancelOrder($pedido);
            }
        }
    }
}