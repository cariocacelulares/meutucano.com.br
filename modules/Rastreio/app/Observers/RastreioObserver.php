<?php namespace Rastreio\Observers;

use Illuminate\Support\Facades\Event;
use Rastreio\Events\RastreioSaved;
use Rastreio\Models\Rastreio;

class RastreioObserver
{
    /**
     * Listen to the Rastreio saved event.
     *
     * @param  Rastreio  $rastreio
     * @return void
     */
    public function saved(Rastreio $rastreio)
    {
        Event::fire(new RastreioSaved($rastreio));
    }
}