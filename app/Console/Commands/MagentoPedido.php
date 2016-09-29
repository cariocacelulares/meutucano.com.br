<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Integracao\MagentoController;

class MagentoPedido extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'magento:pedido {pedido}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa um pedido especifico do Magento';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->argument('pedido')) {
            $return = with(new MagentoController())->syncOrder($this->argument('pedido'));
            $this->comment($return);
        } else {
            throw new \Exception('Um pedido válido precisa ser passado como parâmetro', 1);
        }
    }
}