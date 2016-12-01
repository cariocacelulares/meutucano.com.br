<?php namespace Magento\Console\Commands;

use Illuminate\Console\Command;
use Magento\Http\Controllers\MagentoController;

class RefreshMagentoStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza o estoque do magento baseado no tucano';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new MagentoController())->updateStock();
        $this->comment($return);
    }
}