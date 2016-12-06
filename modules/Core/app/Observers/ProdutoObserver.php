<?php namespace Core\Observers;

use Core\Events\ProductStockChange;
use Core\Models\Produto\Produto;
use Illuminate\Support\Facades\Event;

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
            Event::fire(new ProductStockChange($product));
        }
    }
}