<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\ProductStockUpdated;
use Core\Events\ProductPriceUpdated;
use Core\Models\Produto\Produto;

class ProdutoObserver
{
    /**
     * Listen to the Produto saved event.
     *
     * @param  Produto  $product
     * @return void
     */
    public function saved(Produto $product)
    {
        $dirty = $product->getDirty();

        if (isset($dirty['estoque'])) {
            Event::fire(new ProductStockUpdated($product));
        }

        if (isset($dirty['valor'])) {
            Event::fire(new ProductPriceUpdated($product));
        }
    }
}
