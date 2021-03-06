<?php namespace Rastreio\Console\Commands;

use Illuminate\Console\Command;
use Rastreio\Http\Controllers\RastreioController;

class RefreshRastreios extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:rastreios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza todos rastreios';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new RastreioController())->refreshAll();
        $this->comment($return);
    }
}
