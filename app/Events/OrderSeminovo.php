<?php namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Pedido\PedidoProduto;

class OrderSeminovo extends \Event
{
    use SerializesModels;

    public $pedidoProduto;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(PedidoProduto $pedidoProduto)
    {
        \Log::debug('Evento OrderSeminovo disparado');
        $this->pedidoProduto = $pedidoProduto;
    }
}