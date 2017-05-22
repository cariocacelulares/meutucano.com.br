<?php namespace Core\Observers;

use Core\Models\OrderInvoice;
use Core\Events\OrderInvoiceCreated;
use Illuminate\Support\Facades\Event;

class OrderInvoiceObserver
{
    /**
     * @param  OrderInvoice $orderInvoice
     * @return void
     */
    public function created(OrderInvoice $orderInvoice)
    {
        Event::fire(new OrderInvoiceCreated($orderInvoice));
    }
}
