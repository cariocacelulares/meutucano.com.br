<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Integracao\MagentoController;

class MagentoProdutos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'magento:produtos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza os produtos do magento para o tucano';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new MagentoController())->syncProducts();
        $this->comment($return);
    }
}