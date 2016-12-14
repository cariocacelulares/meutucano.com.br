<?php namespace Skyhub\Console\Commands;

use Illuminate\Console\Command;
use Skyhub\Http\Controllers\SkyhubController;

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
    protected $description = 'Importa pedidos da Skyhub';

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