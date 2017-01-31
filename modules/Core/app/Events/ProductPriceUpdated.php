<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProductPriceUpdated extends \Event
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
        \Log::debug('Evento ProductPriceUpdated disparado!', [$product]);
        $this->product = $product;
    }
}
