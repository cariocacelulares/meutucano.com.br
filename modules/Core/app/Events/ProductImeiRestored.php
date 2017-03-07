<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Produto\ProductImei;

class ProductImeiRestored extends \Event
{
    use SerializesModels;

    public $productImei;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(ProductImei $productImei)
    {
        \Log::debug('Evento ProductImeiRestored disparado');
        $this->productImei = $productImei;
    }
}
