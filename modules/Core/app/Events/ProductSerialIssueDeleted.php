<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\ProductSerialIssue;

class ProductSerialIssueDeleted extends \Event
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
        \Log::debug('Evento ProductSerialIssueDeleted disparado');
        $this->issue = $issue;
    }
}
