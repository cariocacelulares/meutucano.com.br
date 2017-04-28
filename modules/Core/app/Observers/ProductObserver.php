<?php namespace Core\Observers;

use Core\Models\Product;
use Core\Events\ProductPriceUpdated;
use Illuminate\Support\Facades\Event;

class ProductObserver
{
    /**
     * Listen to the Product saved event.
     *
     * @param  Product  $product
     * @return void
     */
    public function saved(Product $product)
    {
        $dirty = $product->getDirty();

        if (isset($dirty['price'])) {
            Event::fire(new ProductPriceUpdated($product));
        }
    }
}
