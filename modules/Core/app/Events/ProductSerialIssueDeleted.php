<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\ProductSerialIssue;

class ProductSerialIssueDeleted extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerialIssue $productSerialIssue
     */
    public $productSerialIssue;

    /**
     * @return void
     */
    public function __construct(ProductSerialIssue $productSerialIssue)
    {
        \Log::debug('Evento ProductSerialIssueDeleted disparado');
        $this->productSerialIssue = $productSerialIssue;
    }
}
