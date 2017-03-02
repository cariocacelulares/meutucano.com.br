<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Models\Stock\Issue;
use Core\Events\StockIssueCreated;

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
}
