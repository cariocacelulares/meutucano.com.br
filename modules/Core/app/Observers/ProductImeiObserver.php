<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\ProductImeiCreated;
use Core\Events\ProductImeiDeleted;
use Core\Events\ProductImeiRestored;
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

    /**
     * Listen to the ProductImei deleted event.
     *
     * @param  ProductImei $productImei
     * @return void
     */
    public function deleted(ProductImei $productImei)
    {
        Event::fire(new ProductImeiDeleted($productImei));
    }

    /**
     * Listen to the ProductImei restored event.
     *
     * @param  ProductImei $productImei
     * @return void
     */
    public function restored(ProductImei $productImei)
    {
        Event::fire(new ProductImeiRestored($productImei));
    }
}
