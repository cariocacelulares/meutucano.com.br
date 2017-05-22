<?php namespace Core\Events;

use Core\Models\OrderProduct;
use Illuminate\Queue\SerializesModels;

class OrderProductDeleted extends \Event
{
    use SerializesModels;

    /**
     * @param OrderProduct $orderProduct
     */
    public $orderProduct;

    /**
     * @return void
     */
    public function __construct(OrderProduct $orderProduct)
    {
        \Log::debug('Evento OrderProductDeleting disparado');
        $this->orderProduct = $orderProduct;
    }
}
