<?php namespace Core\Observers;

use Core\Models\ProductSerialDefect;
use Core\Events\ProductSerialDefectCreated;
use Core\Events\ProductSerialDefectDeleted;
use Illuminate\Support\Facades\Event;

class ProductSerialDefectObserver
{
    /**
     * Listen to the ProductSerialDefect created event.
     *
     * @param  ProductSerialDefect $productSerialDefect
     * @return void
     */
    public function created(ProductSerialDefect $productSerialDefect)
    {
        Event::fire(new ProductSerialDefectCreated($productSerialDefect));
    }

    /**
     * Listen to the ProductSerialDefect deleted event.
     *
     * @param  ProductSerialDefect $productSerialDefect
     * @return void
     */
    public function deleted(ProductSerialDefect $productSerialDefect)
    {
        Event::fire(new ProductSerialDefectDeleted($productSerialDefect));
    }
}
