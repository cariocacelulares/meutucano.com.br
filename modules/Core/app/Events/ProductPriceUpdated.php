<?php namespace Core\Events;

use Core\Models\Product;
use Illuminate\Queue\SerializesModels;

class ProductPriceUpdated extends \Event
{
    use SerializesModels;

    /**
     * @param Product $product
     */
    public $product;

    /**
     * @return void
     */
    public function __construct(Product $product)
    {
        \Log::debug('Evento ProductPriceUpdated disparado!', [$product]);
        $this->product = $product;
    }
}
