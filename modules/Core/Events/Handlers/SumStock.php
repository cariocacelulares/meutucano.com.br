<?php namespace Modules\Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Modules\Core\Events\OrderCancel;

class SumStock
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
            '\Modules\Core\Events\Handlers\SumStock@onOrderCancel'
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
        \Log::debug('Listener SumStock ativado. pedido: ' . $pedido->id);

        foreach ($pedido->produtos()->get() as $pedidoProduto) {
            try {
                $produto = $pedidoProduto->produto;
                $oldEstoque = $produto->estoque;
                $produto->estoque = $oldEstoque + $pedidoProduto->quantidade;
                if ($produto->save()) {
                    \Log::notice("Estoque do produto {$produto->sku} alterado de {$oldEstoque} para {$produto->estoque}.");
                } else {
                    \Log::warning("Não foi possível somar o estoque do produto {$produto->sku} no tucano.");
                }
            } catch (Exception $e) {
                \Log::warning("Não foi possível somar o estoque do produto {$produto->sku} no tucano.");
                reportError('Não foi possível somar o estoque no tucano: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $produto->sku);
            }
        }
    }
}