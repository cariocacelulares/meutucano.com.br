<?php namespace Core\Observers;

use Illuminate\Support\Facades\Event;
use Core\Events\DefectCreated;
use Core\Events\DefectDeleted;
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

    /**
     * Listen to the Defect deleted event.
     *
     * @param  Defect $defect
     * @return void
     */
    public function deleted(Defect $defect)
    {
        Event::fire(new DefectDeleted($defect));
    }
}
