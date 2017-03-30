<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProductStockUpdated extends \Event
{
    use SerializesModels;

    public $productStock;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($productStock)
    {
        \Log::debug('Evento ProductStockUpdated disparado!', [$productStock]);
        $this->productStock = $productStock;
    }
}
