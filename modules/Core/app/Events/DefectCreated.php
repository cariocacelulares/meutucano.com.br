<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Produto\Defect;

class DefectCreated extends \Event
{
    use SerializesModels;

    public $defect;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Defect $defect)
    {
        \Log::debug('Evento DefectCreated disparado');
        $this->defect = $defect;
    }
}
