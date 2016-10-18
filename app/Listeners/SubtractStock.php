<?php namespace App\Listeners;

use App\Events\ProductDispach;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SubtractStock
{
    /**
     * Handle the event.
     *
     * @param  ProductDispach  $event
     * @return void
     */
    public function handle(ProductDispach $event)
    {
        $produto = $event->produto;
        $quantidade = (int)$event->quantidade;
        \Log::debug('Listener SubtractStock ativado. produto: ' . $produto->sku);

        try {
            $oldEstoque = $produto->estoque;

            if ($produto && isset($quantidade)) {
                $produto->estoque = $oldEstoque - $quantidade;
                if ($produto->save()) {
                    \Log::notice("Estoque do produto {$produto->sku} alterado de {$oldEstoque} para {$produto->estoque}.");
                } else {
                    \Log::warning("Não foi possível subtrair o estoque do produto {$produto->sku} no tucano.");
                }
            } else {
                \Log::warning('Não foi possível subtrair o estoque de um produto no tucano.', [$produto, $quantidade]);
                reportError('Não foi possível subtrair o estoque no tucano, consulte os logs para detalhes - ' . ($produto && $produto->sku) ? "sku: {$produto->sku}" : '');
            }
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, "Não foi possível subtrair o estoque do produto {$produto->sku} no tucano."));
            reportError('Não foi possível subtrair o estoque no tucano: ' . $e->getMessage() . ' - ' . $e->getLine() . ' - ' . $produto->sku);
        }
    }
}