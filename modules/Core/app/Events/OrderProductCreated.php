<?php namespace Core\Events;

use Core\Models\OrderProduct;
use Illuminate\Queue\SerializesModels;

class OrderProductCreated extends \Event
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
        \Log::debug('Evento OrderProductCreated disparado');
        $this->orderProduct = $orderProduct;
    }
}
