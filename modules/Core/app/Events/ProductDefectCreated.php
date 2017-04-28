<?php namespace Core\Events;

use Core\Models\ProductDefect;
use Illuminate\Queue\SerializesModels;

class ProductDefectCreated extends \Event
{
    use SerializesModels;

    /**
     * @param ProductDefect $defect
     */
    public $defect;

    /**
     * @return void
     */
    public function __construct(ProductDefect $defect)
    {
        \Log::debug('Evento ProductDefectCreated disparado');
        $this->defect = $defect;
    }
}
