<?php namespace App\Console\Commands;

use App\Http\Controllers\AnymarketController;
use Illuminate\Console\Command;

class AnymarketImportPedidos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'anymarket:pedidos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa pedidos da anymarket';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $count = with(new AnymarketController())->feedSale();
        $this->comment($count);
    }
}
