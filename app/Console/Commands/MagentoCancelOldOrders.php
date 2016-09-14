<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Integracao\MagentoController;

class MagentoCancelOldOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'magento:cancel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancela pedidos pendentes a mais de 7 dias úteis';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new MagentoController())->cancelOldOrders();
        $this->comment($return);
    }
}