<?php namespace Core\Console\Commands;

use Core\Models\Order;
use Illuminate\Console\Command;
use Core\Http\Controllers\Order\OrderController;

class InvoiceOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:invoice {orders}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Invoice orders manually (use commas to separate ids)';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $orderCodes = $this->argument('orders');
        $orderCodes = $orderCodes ? explode(',', $orderCodes) : [];

        $i = 0;
        $total = count($orderCodes);
        try {
            foreach ($orderCodes as $code) {
                $order = Order::where('api_code', '=', $code)->first();

                if ($order) {
                    with(new OrderController())->invoice($order->id);
                    $i++;
                }
            }
        } catch (\Exception $exception) {
            logMessage($exception, 'Erro ao executar comando orders:invoice');
            $this->comment('Ocorreu um erro');
        }

        $this->comment("{$i} de {$total} pedidos foram fatutado(s)");
    }
}
