<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\DefectCreated;
use Core\Models\Produto\Defect;

class DefectObserver
{
    /**
     * Listen to the Defect created event.
     *
     * @param  Defect $defect
     * @return void
     */
    public function created(Defect $defect)
    {
        Event::fire(new DefectCreated($defect));
    }
}
