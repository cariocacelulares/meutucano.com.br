<?php namespace Allnation\Console\Commands;

use Illuminate\Console\Command;
use Allnation\Http\Controllers\AllnationProductController;

class AllnationProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'allnation:products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza os produtos da allnation';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new AllnationProductController())->fetchProducts();
        $this->comment($return);
    }
}
