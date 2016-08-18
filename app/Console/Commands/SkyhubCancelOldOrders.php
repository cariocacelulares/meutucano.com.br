<?php namespace App\Console\Commands;

use App\Http\Controllers\SkyhubController;
use Illuminate\Console\Command;

class SkyhubCancelOldOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'skyhub:cancel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancela os pedidos com mais de 3 dias úteis sem pagamento';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new SkyhubController())->cancelOldOrders();
        $this->comment($return);
    }
}
