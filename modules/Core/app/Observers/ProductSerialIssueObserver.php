<?php namespace Core\Observers;

use Core\Models\ProductSerialIssue;
use Illuminate\Support\Facades\Event;
use Core\Events\ProductSerialIssueCreated;
use Core\Events\ProductSerialIssueDeleted;

class ProductSerialIssueObserver
{
    /**
     * Listen to the Issue created event.
     *
     * @param  Issue $issue
     * @return void
     */
    public function created(Issue $issue)
    {
        Event::fire(new ProductSerialIssueCreated($issue));
    }

    /**
     * Listen to the Issue deleted event.
     *
     * @param  Issue $issue
     * @return void
     */
    public function deleted(Issue $issue)
    {
        Event::fire(new ProductSerialIssueDeleted($issue));
    }
}
