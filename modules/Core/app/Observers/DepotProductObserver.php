<?php namespace Core\Observers;

use Core\Models\DepotProduct;
use Core\Events\DepotProductUpdated;
use Illuminate\Support\Facades\Event;

class DepotProductObserver
{
    /**
     * Listen to the DepotProduct saved event.
     *
     * @param  DepotProduct  $depotProduct
     * @return void
     */
    public function saved(DepotProduct $depotProduct)
    {
        $dirty = $depotProduct->getDirty();

        if (isset($dirty['quantity'])) {
            Event::fire(new DepotProductUpdated($depotProduct));
        }
    }
}
