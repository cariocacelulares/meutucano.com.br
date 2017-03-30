<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Stock\Issue;

class StockIssueCreated extends \Event
{
    use SerializesModels;

    public $issue;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Issue $issue)
    {
        \Log::debug('Evento StockIssueCreated disparado');
        $this->issue = $issue;
    }
}
