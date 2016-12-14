<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProductStockUpdated extends \Event
{
    use SerializesModels;

    public $product;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($product)
    {
        \Log::debug('Evento ProductStockUpdated disparado!', [$product]);
        $this->product = $product;
    }
}