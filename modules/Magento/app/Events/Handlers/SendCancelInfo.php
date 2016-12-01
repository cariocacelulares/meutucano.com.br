<?php namespace Magento\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Core\Events\OrderCancel;
use Magento\Http\Controllers\MagentoController;

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
            '\Magento\Events\Handlers\SendCancelInfo@onOrderCancel'
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
        \Log::debug('Listener Magento\SendCancelInfo ativado. pedido: ' . $pedido->id);

        if (strtolower($pedido->marketplace) == 'site') {
            with(new MagentoController())->cancelOrder($pedido);
        }
    }
}