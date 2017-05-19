<?php namespace Core\Events;

use Core\Models\ProductSerialIssue;
use Illuminate\Queue\SerializesModels;

class ProductSerialIssueCreated extends \Event
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
        \Log::debug('Evento ProductSerialIssueCreated disparado');
        $this->productSerialIssue = $productSerialIssue;
    }
}
