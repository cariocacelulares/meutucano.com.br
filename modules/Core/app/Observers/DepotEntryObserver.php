<?php namespace Core\Observers;

use Core\Models\DepotEntry;
use Core\Events\DepotEntryConfirmed;
use Illuminate\Support\Facades\Event;

class DepotEntryObserver
{
    /**
     * Listen to the Entry saved event.
     *
     * @param  Entry $entry
     * @return void
     */
    public function saved(DepotEntry $entry)
    {
        $dirty = $entry->getDirty();

        if (isset($dirty['confirmed_at']) && $dirty['confirmed_at']) {
            Event::fire(new DepotEntryConfirmed($entry));
        }
    }
}
