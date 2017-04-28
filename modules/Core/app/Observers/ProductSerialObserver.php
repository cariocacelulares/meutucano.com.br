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
     * @param  ProductSerial $serial
     * @return void
     */
    public function created(ProductSerial $serial)
    {
        Event::fire(new ProductSerialCreated($serial));
    }

    /**
     * Listen to the ProductSerial deleted event.
     *
     * @param  ProductSerial $serial
     * @return void
     */
    public function deleted(ProductSerial $serial)
    {
        Event::fire(new ProductSerialDeleted($serial));
    }

    /**
     * Listen to the ProductSerial restored event.
     *
     * @param  ProductSerial $serial
     * @return void
     */
    public function restored(ProductSerial $serial)
    {
        Event::fire(new ProductSerialRestored($serial));
    }
}
