<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\ProductStockUpdated;
use Core\Models\Produto\ProductStock;

class ProductStockObserver
{
    /**
     * Listen to the ProductStock saved event.
     *
     * @param  ProductStock  $productStock
     * @return void
     */
    public function saved(ProductStock $productStock)
    {
        $dirty = $productStock->getDirty();

        if (isset($dirty['quantity'])) {
            Event::fire(new ProductStockUpdated($productStock));
        }
    }
}
