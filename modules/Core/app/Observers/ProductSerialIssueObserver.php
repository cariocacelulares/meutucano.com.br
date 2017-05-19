<?php namespace Core\Observers;

use Core\Models\ProductSerialIssue;
use Illuminate\Support\Facades\Event;
use Core\Events\ProductSerialIssueCreated;
use Core\Events\ProductSerialIssueDeleted;

class ProductSerialIssueObserver
{
    /**
     * Listen to the ProductSerialIssue created event.
     *
     * @param  ProductSerialIssue $productSerialIssue
     * @return void
     */
    public function created(ProductSerialIssue $productSerialIssue)
    {
        Event::fire(new ProductSerialIssueCreated($productSerialIssue));
    }

    /**
     * Listen to the ProductSerialIssue deleted event.
     *
     * @param  ProductSerialIssue $productSerialIssue
     * @return void
     */
    public function deleted(ProductSerialIssue $productSerialIssue)
    {
        Event::fire(new ProductSerialIssueDeleted($productSerialIssue));
    }
}
