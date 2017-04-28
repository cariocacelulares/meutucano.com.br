<?php namespace Core\Events;

use Core\Models\OrderProduct;
use Illuminate\Queue\SerializesModels;

class OrderProductUpdated extends \Event
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
        \Log::debug('Evento OrderProductUpdated disparado');
        $this->orderProduct = $orderProduct;
    }
}
