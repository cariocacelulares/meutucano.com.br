<?php namespace App\Listeners;

use App\Events\OrderCancel;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Controllers\Integracao\MagentoController;

class SumStock
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