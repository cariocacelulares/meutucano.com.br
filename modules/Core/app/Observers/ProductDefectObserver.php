<?php namespace Core\Observers;

use Core\Models\ProductDefect;
use Core\Events\ProductDefectCreated;
use Core\Events\ProductDefectDeleted;
use Illuminate\Support\Facades\Event;

class ProductDefectObserver
{
    /**
     * Listen to the ProductDefect created event.
     *
     * @param  ProductDefect $defect
     * @return void
     */
    public function created(ProductDefect $defect)
    {
        Event::fire(new ProductDefectCreated($defect));
    }

    /**
     * Listen to the ProductDefect deleted event.
     *
     * @param  ProductDefect $defect
     * @return void
     */
    public function deleted(ProductDefect $defect)
    {
        Event::fire(new ProductDefectDeleted($defect));
    }
}
