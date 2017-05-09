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
     * @param  ProductSerialDefect $defect
     * @return void
     */
    public function created(ProductSerialDefect $defect)
    {
        Event::fire(new ProductSerialDefectCreated($defect));
    }

    /**
     * Listen to the ProductSerialDefect deleted event.
     *
     * @param  ProductSerialDefect $defect
     * @return void
     */
    public function deleted(ProductSerialDefect $defect)
    {
        Event::fire(new ProductSerialDefectDeleted($defect));
    }
}
