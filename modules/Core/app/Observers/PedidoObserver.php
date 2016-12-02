<?php namespace Core\Observers;

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
        \Event::fire(new OrderSaved($order));

        $oldStatus = ($order->getOriginal('status') === null) ? null : (int)$order->getOriginal('status');
        $newStatus = (is_null($order->status)) ? null : (int)$order->status;

        if ($newStatus !== $oldStatus) {
            switch ($newStatus) {
                case 1: // Pago
                    \Event::fire(new OrderPaid($order));
                    break;
                case 2: // Enviado
                    \Event::fire(new OrderSent($order));
                    break;
                case 3: // Entregue
                    \Event::fire(new OrderDelivered($order));
                    break;
                case 5: // Cancelado
                    \Event::fire(new OrderCanceled($order));
                    break;
            }
        }

        /*
        // Se realmente ocorreu uma mudança de status e o pedido não veio do site
        if ($newStatus !== $oldStatus && strtolower($order->marketplace) != 'site') {
            // Se o novo status for entregue, notifica a Skyhub
            if ($newStatus === 3) {
                with(new SkyhubController())->orderDelivered($order);
            }
        }

        // Se o status foi alterado e o novo status for pago
        if ($newStatus !== $oldStatus && $newStatus === 1) {
            // pra cada produto do pedido
            foreach ($order->produtos as $orderProduto) {
                // se o produto do pedido nao tiver inspecao tecnica nem imei, e for seminovo
                if (!$orderProduto->inspecao_tecnica && !$orderProduto->imei && $orderProduto->produto->estado == 1) {
                    \Event::fire(new OrderSeminovo($orderProduto));
                }
            }
        }*/
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