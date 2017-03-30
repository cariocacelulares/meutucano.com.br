<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\EntryConfirmed;
use Core\Models\Produto;

class SetProductCost
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
            EntryConfirmed::class,
            '\Core\Events\Handlers\SetProductCost@onEntryConfirmed'
        );
    }

    /**
     * Handle the event.
     *
     * @param  EntryConfirmed $event
     * @return void
     */
    public function onEntryConfirmed(EntryConfirmed $event)
    {
        Log::debug('Handler SetProductCost/onEntryConfirmed acionado!', [$event]);
        $entry = $event->entry;

        try {
            foreach ($entry->products as $entryProduct) {
                $product = Produto::find($entryProduct->product->sku);

                if ($product) {
                    $product->cost = $this->getCost($product);
                    $product->save();
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao calcular o custo dos produtos'), [$entry->toArray()]);
        }
    }

    /**
     * Calculate product const
     * @param  Produto  $product
     * @return float
     */
    private function getCost($product)
    {
        if (!$product) {
            return 0;
        }

        $totalQty   = 0;
        $totalValue = 0;

        // pra cada produto com esse sku em uma entrada
        foreach ($product->entryProducts as $entryProduct) {
            $qty = 0;

            // se a entrtada estiver confirmada
            if (!is_null($entryProduct->entry->confirmed_at)) {
                // pra cada imei da entrada
                foreach ($entryProduct->entryImeis as $entryImei) {
                    // se está no estoque, considera
                    if ($entryImei->productImei->inStock()) {
                        $qty++;
                    }
                }

                if ($qty > 0) {
                    $totalQty   += $qty;
                    $totalValue += ($entryProduct->unitary_value * $qty);
                }
            }
        }

        return $totalValue ? ($totalValue / $totalQty) : $totalValue;
    }
}
