<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Models\Pedido\Pedido;
use Core\Events\OrderCanceled;
use Core\Events\OrderCreated;
use Core\Events\OrderDelivered;
use Core\Events\OrderPaid;
use Core\Events\OrderSaved;
use Core\Events\OrderSent;
use Core\Events\OrderUpdated;

class PedidoObserver
{
    /**
     * Listen to the Pedido saved event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function saved(Pedido $order)
    {
        Event::fire(new OrderSaved($order));

        $dirty = $order->getDirty();
        if (isset($dirty['status'])) {
            $status = ((is_null($order->status)) ? null : (int)$order->status);

            switch ($status) {
                case 1: // Pago
                    Event::fire(new OrderPaid($order));
                    break;
                case 2: // Enviado
                    Event::fire(new OrderSent($order));
                    break;
                case 3: // Entregue
                    Event::fire(new OrderDelivered($order));
                    break;
                case 5: // Cancelado
                    Event::fire(new OrderCanceled($order));
                    break;
            }
        }
    }

    /**
     * Listen to the Pedido updated event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function updated(Pedido $order)
    {
        Event::fire(new OrderUpdated($order));
    }

    /**
     * Listen to the Pedido created event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function created(Pedido $order)
    {
        Event::fire(new OrderCreated($order));
    }

    /**
     * Listen to the Pedido deleting event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function deleting(Pedido $order)
    {
        $order->notas()->delete();
        $order->rastreios()->delete();
    }

    /**
     * Listen to the Pedido restoring event.
     *
     * @param  Pedido  $order
     * @return void
     */
    public function restoring(Pedido $order)
    {
        $order->notas()->withTrashed()->restore();
        $order->rastreios()->withTrashed()->restore();
    }
}