<?php namespace Core\Events;

use Core\Models\ProductSerialDefect;
use Illuminate\Queue\SerializesModels;

class ProductSerialDefectCreated extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerialDefect $productSerialDefect
     */
    public $productSerialDefect;

    /**
     * @return void
     */
    public function __construct(ProductSerialDefect $productSerialDefect)
    {
        \Log::debug('Evento ProductSerialDefectCreated disparado');
        $this->productSerialDefect = $productSerialDefect;
    }
}
