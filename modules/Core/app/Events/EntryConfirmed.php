<?php namespace Core\Events;

use Illuminate\Queue\SerializesModels;
use Core\Models\Stock\Entry;

class EntryConfirmed extends \Event
{
    use SerializesModels;

    public $entry;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Defect $entry)
    {
        \Log::debug('Evento EntryConfirmed disparado');
        $this->entry = $entry;
    }
}
