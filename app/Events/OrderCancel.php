<?php namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Pedido\Pedido;

class OrderCancel extends \Event
{
    use SerializesModels;

    public $order;
    public $user_id;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Pedido $order, $currentUserId = null)
    {
        \Log::debug('Evento OrderCancel disparado');
        $this->order = $order;

        if (!$currentUserId || is_null(!$currentUserId)) {
            $this->user_id = false;
        } else {
            $this->user_id = $currentUserId;
        }
    }
}