<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\OrderSent;
use Core\Models\Produto;

class SetProductImeiCost
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
            OrderSent::class,
            '\Core\Events\Handlers\SetProductImeiCost@onOrderSent'
        );
    }

    /**
     * Handle the event.
     *
     * @param  OrderSent $event
     * @return void
     */
    public function onOrderSent(OrderSent $event)
    {
        Log::debug('Handler SetProductImeiCost/onOrderSent acionado!', [$event]);
        $order = $event->order;

        try {
            foreach ($order->produtos as $orderProduct) {
                $productImei = $orderProduct->productImei;

                if ($productImei) {
                    $productImei->cost = $orderProduct->produto->cost;
                    $productImei->save();
                }
            }
        } catch (\Exception $exception) {
            Log::warning(logMessage($exception, 'Erro ao calcular o custo dos seriais'), [$order->toArray()]);
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
