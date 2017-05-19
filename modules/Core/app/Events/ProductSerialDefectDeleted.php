<?php namespace Core\Events;

use Core\Models\ProductSerialDefect;
use Illuminate\Queue\SerializesModels;

class ProductSerialDefectDeleted extends \Event
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
        \Log::debug('Evento ProductSerialDefectDeleted disparado');
        $this->productSerialDefect = $productSerialDefect;
    }
}
