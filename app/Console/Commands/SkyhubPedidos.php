<?php namespace App\Console\Commands;

use App\Http\Controllers\Integracao\SkyhubController;
use Illuminate\Console\Command;

class SkyhubPedidos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'skyhub:pedidos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa pedidos aprovados da Skyhub';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new SkyhubController())->queue();
        $this->comment($return);
    }
}
