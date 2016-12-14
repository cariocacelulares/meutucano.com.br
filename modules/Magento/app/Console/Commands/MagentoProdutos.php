<?php namespace Magento\Console\Commands;

use Illuminate\Console\Command;
use Magento\Http\Controllers\MagentoController;

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