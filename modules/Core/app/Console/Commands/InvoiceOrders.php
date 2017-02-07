<?php namespace Core\Console\Commands;

use Illuminate\Console\Command;
use Core\Models\Pedido\Pedido;
use Core\Http\Controllers\Pedido\PedidoController;

class InvoiceOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pedidos:faturar {orders}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Considera os pedidos como enviados (separado por ,)';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $pedidos = $this->argument('orders');
        $pedidos = $pedidos ? explode(',', $pedidos) : [];

        $i = 0;
        $total = count($pedidos);
        try {
            foreach ($pedidos as $codigoMarketplace) {
                $pedido = Pedido::where('codigo_marketplace', '=', $codigoMarketplace)->first();

                if ($pedido) {
                    with(new PedidoController())->faturar($pedido->id);
                    $i++;
                }
            }
        } catch (\Exception $exception) {
            logMessage($exception, 'Erro ao executar comando pedidos:invoice');
            $this->comment('Ocorreu um erro');
        }

        $this->comment("{$i} de {$total} pedidos foram fatutado(s)");
    }
}
