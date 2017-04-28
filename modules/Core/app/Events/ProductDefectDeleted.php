<?php namespace Core\Events;

use Core\Models\ProductDefect;
use Illuminate\Queue\SerializesModels;

class ProductDefectDeleted extends \Event
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
        \Log::debug('Evento ProductDefectDeleted disparado');
        $this->defect = $defect;
    }
}
