<?php namespace Core\Events;

use Core\Models\ProductSerialIssue;
use Illuminate\Queue\SerializesModels;

class ProductSerialIssueCreated extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerialIssue $issue
     */
    public $issue;

    /**
     * @return void
     */
    public function __construct(ProductSerialIssue $issue)
    {
        \Log::debug('Evento ProductSerialIssueCreated disparado');
        $this->issue = $issue;
    }
}
