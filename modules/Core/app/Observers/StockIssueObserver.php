<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Models\Stock\Issue;
use Core\Events\StockIssueCreated;
use Core\Events\StockIssueDeleted;

class StockIssueObserver
{
    /**
     * Listen to the Issue created event.
     *
     * @param  Issue $issue
     * @return void
     */
    public function created(Issue $issue)
    {
        Event::fire(new StockIssueCreated($issue));
    }

    /**
     * Listen to the Issue deleted event.
     *
     * @param  Issue $issue
     * @return void
     */
    public function deleted(Issue $issue)
    {
        Event::fire(new StockIssueDeleted($issue));
    }
}
