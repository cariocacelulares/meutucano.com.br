<?php namespace Rastreio\Events;

use Illuminate\Queue\SerializesModels;
use Rastreio\Models\Rastreio;

class RastreioSaved extends \Event
{
    use SerializesModels;

    public $rastreio;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Rastreio $rastreio)
    {
        \Log::debug('Evento RastreioSaved disparado');
        $this->rastreio = $rastreio;
    }
}
