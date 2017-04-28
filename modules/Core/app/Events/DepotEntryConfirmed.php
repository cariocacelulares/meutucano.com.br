<?php namespace Core\Events;

use Core\Models\DepotEntry;
use Illuminate\Queue\SerializesModels;

class DepotEntryConfirmed extends \Event
{
    use SerializesModels;

    /**
     * @param DepotEntry $entry
     */
    public $entry;

    /**
     * @return void
     */
    public function __construct(DepotEntry $entry)
    {
        \Log::debug('Evento DepotEntryConfirmed disparado');
        $this->entry = $entry;
    }
}
