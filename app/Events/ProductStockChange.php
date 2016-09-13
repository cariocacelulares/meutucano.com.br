<?php
namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProductStockChange extends \Event
{
    use SerializesModels;

    public $produto_sku;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($produto_sku)
    {
        \Log::debug('Evento ProductStockChange disparado');
        $this->produto_sku = $produto_sku;
    }
}