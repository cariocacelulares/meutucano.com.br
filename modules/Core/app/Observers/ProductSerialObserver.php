<?php namespace Core\Observers;

use Core\Models\ProductSerial;
use Core\Events\ProductSerialCreated;
use Core\Events\ProductSerialDeleted;
use Core\Events\ProductSerialRestored;
use Illuminate\Support\Facades\Event;

class ProductSerialObserver
{
    /**
     * Listen to the ProductSerial created event.
     *
     * @param  ProductSerial $productSerial
     * @return void
     */
    public function created(ProductSerial $productSerial)
    {
        Event::fire(new ProductSerialCreated($productSerial));
    }

    /**
     * Listen to the ProductSerial deleted event.
     *
     * @param  ProductSerial $productSerial
     * @return void
     */
    public function deleted(ProductSerial $productSerial)
    {
        Event::fire(new ProductSerialDeleted($productSerial));
    }

    /**
     * Listen to the ProductSerial restored event.
     *
     * @param  ProductSerial $productSerial
     * @return void
     */
    public function restored(ProductSerial $productSerial)
    {
        Event::fire(new ProductSerialRestored($productSerial));
    }
}
