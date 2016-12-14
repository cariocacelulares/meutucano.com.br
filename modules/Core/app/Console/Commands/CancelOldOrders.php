<?php namespace Core\Console\Commands;

use Illuminate\Console\Command;
use Core\Http\Controllers\Pedido\PedidoController;

class CancelOldOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pedidos:cancelold';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancela pedidos pendentes a mais de x dias úteis';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new PedidoController())->cancelOldOrders();
        $this->comment($return);
    }
}