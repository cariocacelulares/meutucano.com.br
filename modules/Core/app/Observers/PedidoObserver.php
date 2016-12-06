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
            \Log::debug('wut', [$order->getOriginal('status'), $dirty['status'], $order->status]);
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
        /*$oldStatus = ($order->getOriginal('status') === null) ? null : (int) $order->getOriginal('status');
        $newStatus = ($order->status === null) ? null : (int)$order->status;

        // Se realmente ocorreu uma mudança de status
        if ($newStatus !== $oldStatus) {
            // Se o status for cancelado
            if ($newStatus === 5) {

                // Dispara o evento de cancelamento do pedido
                \Event::fire(new OrderCancel($order, getCurrentUserId()));

                // Se o status era enviado, pago ou entregue
                if (in_array($oldStatus, [1, 2, 3])) {
                    $order->reembolso = true;
                }

                // Se tiver alguma inspeção na fila, deleta ela
                foreach ($order->produtos()->get() as $orderProduto) {
                    $inspecoes = InspecaoTecnica
                        ::where('pedido_produtos_id', '=', $orderProduto->id)
                        ->whereNull('revisado_at')
                        ->delete();
                }
            }
        }*/
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