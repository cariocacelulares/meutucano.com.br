<?php namespace Core\Events;

use Core\Models\ProductSerialDefect;
use Illuminate\Queue\SerializesModels;

class ProductSerialDefectDeleted extends \Event
{
    use SerializesModels;

    /**
     * @param ProductSerialDefect $defect
     */
    public $defect;

    /**
     * @return void
     */
    public function __construct(ProductSerialDefect $defect)
    {
        \Log::debug('Evento ProductSerialDefectDeleted disparado');
        $this->defect = $defect;
    }
}
