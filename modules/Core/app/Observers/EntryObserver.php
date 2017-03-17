<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\EntryConfirmed;
use Core\Models\Stock\Entry;

class EntryObserver
{
    /**
     * Listen to the Entry saved event.
     *
     * @param  Entry $entry
     * @return void
     */
    public function saved(Entry $entry)
    {
        $dirty = $entry->getDirty();

        if (isset($dirty['confirmed_at']) && $dirty['confirmed_at']) {
            Event::fire(new EntryConfirmed($entry));
        }
    }
}
