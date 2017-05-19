<?php namespace Core\Events\Handlers;

use Core\Models\Product;
use Core\Events\DepotEntryConfirmed;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;

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
            DepotEntryConfirmed::class,
            '\Core\Events\Handlers\SetProductCost@onDepotEntryConfirmed'
        );
    }

    /**
     * Handle the event.
     *
     * @param  DepotEntryConfirmed $event
     * @return void
     */
    public function onDepotEntryConfirmed(DepotEntryConfirmed $event)
    {
        Log::debug('Handler SetProductCost/onDepotEntryConfirmed acionado!', [$event]);
        $depotEntry = $event->depotEntry;

        try {
            foreach ($depotEntry->products as $depotEntryProduct) {
                $product = Product::find($depotEntryProduct->product->sku);

                if ($product) {
                    $product->cost = $this->getCost($product);
                    $product->save();
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao calcular o custo dos produtos'), [$depotEntry->toArray()]);
        }
    }

    /**
     * Calculate product const
     *
     * @param  Product  $product
     * @return float
     */
    private function getCost($product)
    {
        if (!$product) return 0;

        $totalQty   = 0;
        $totalValue = 0;

        foreach ($product->depotEntryProducts as $entryProduct) {
            $qty = 0;

            if ($entryProduct->entry->confirmed) {
                foreach ($entryProduct->serials as $serial) {
                    if ($serial->productSerial->in_stock) {
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
