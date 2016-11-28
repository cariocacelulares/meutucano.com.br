<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\Magento\Http\Controllers\MagentoController;

class MagentoPedidos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'magento:pedidos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa pedidos do Magento';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new MagentoController())->queue();
        $this->comment($return);
    }
}