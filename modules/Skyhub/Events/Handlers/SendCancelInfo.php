<?php namespace Modules\Skyhub\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Modules\Core\Events\OrderCancel;
use App\Http\Controllers\Integracao\SkyhubController;

class SendCancelInfo
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
            OrderCancel::class,
            '\Modules\Skyhub\Events\Handlers\SendCancelInfo@onOrderCancel'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderCancel  $event
     * @return void
     */
    public function onOrderCancel(OrderCancel $event)
    {
        $pedido = $event->order;
        $user_id = $event->user_id;
        \Log::debug('Listener Skyhub\SendCancelInfo ativado. pedido: ' . $pedido->id);

        if (strtolower($pedido->marketplace) != 'site') {
            if ($user_id === false) {
                \Log::debug('Nenhuma informação de cancelamento foi enviada, pois não existe usuário logado!');
            } else {
                \Log::debug('Cancela na skyhub');
                with(new SkyhubController())->cancelOrder($pedido);
            }
        }
    }
}