<?php namespace Skyhub\Console\Commands;

use Illuminate\Console\Command;
use Skyhub\Http\Controllers\SkyhubController;

class SkyhubPedido extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'skyhub:pedido {pedido}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa um pedido especifico da Skyhub';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->argument('pedido')) {
            $return = with(new SkyhubController())->syncOrder($this->argument('pedido'));
            $this->comment($return);
        } else {
            throw new \Exception('Um pedido válido precisa ser passado como parâmetro', 1);
        }
    }
}