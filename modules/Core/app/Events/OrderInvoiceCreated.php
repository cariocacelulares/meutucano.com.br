<?php namespace Core\Events;

use Core\Models\OrderInvoice;
use Illuminate\Queue\SerializesModels;

class OrderInvoiceCreated extends \Event
{
    use SerializesModels;

    /**
     * @param OrderInvoice $orderInvoice
     */
    public $orderInvoice;

    /**
     * @return void
     */
    public function __construct(OrderInvoice $orderInvoice)
    {
        \Log::debug('Evento OrderInvoiced disparado');
        $this->orderInvoice = $orderInvoice;
    }
}
