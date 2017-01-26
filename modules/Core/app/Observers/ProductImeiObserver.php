<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\ProductImeiCreated;
use Core\Models\Produto\ProductImei;

class ProductImeiObserver
{
    /**
     * Listen to the ProductImei created event.
     *
     * @param  ProductImei $productImei
     * @return void
     */
    public function created(ProductImei $productImei)
    {
        Event::fire(new ProductImeiCreated($productImei));
    }
}
