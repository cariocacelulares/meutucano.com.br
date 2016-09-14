<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Integracao\SkyhubController;

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
    protected $description = 'Cancela pedidos pendentes a mais de 4 dias úteis';

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