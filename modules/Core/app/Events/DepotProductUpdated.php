<?php namespace Core\Events;

use Core\Models\DepotProduct;
use Illuminate\Queue\SerializesModels;

class DepotProductUpdated extends \Event
{
    use SerializesModels;

    /**
     * @param DepotProduct $depotProduct
     */
    public $depotProduct;

    /**
     * @return void
     */
    public function __construct(DepotProduct $depotProduct)
    {
        \Log::debug('Evento DepotProductUpdated disparado!', [$depotProduct]);
        $this->depotProduct = $depotProduct;
    }
}
