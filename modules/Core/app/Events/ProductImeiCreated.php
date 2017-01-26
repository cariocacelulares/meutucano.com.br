<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Produto\ProductImei;

class ProductImeiCreated extends \Event
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
        \Log::debug('Evento ProductImeiCreated disparado');
        $this->productImei = $productImei;
    }
}
