<?php namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Produto\Produto;

class ProductDispach extends \Event
{
    use SerializesModels;

    public $produto;
    public $quantidade;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Produto $produto, $quantidade)
    {
        \Log::debug('Evento ProductDispach disparado');
        $this->produto = $produto;
        $this->quantidade = $quantidade;
    }
}