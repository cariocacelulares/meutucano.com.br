<?php namespace Allnation\Console\Commands;

use Illuminate\Console\Command;
use Allnation\Http\Controllers\AllnationProductController;

class AllnationStockAndPrice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'allnation:stocks-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza os precos e estoques da allnation';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new AllnationProductController())->fetchStocks();
        $this->comment($return);
    }
}
