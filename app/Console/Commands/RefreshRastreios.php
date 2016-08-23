<?php namespace App\Console\Commands;

use App\Http\Controllers\Rastreio\RastreioController;
use Illuminate\Console\Command;

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
        with(new RastreioController())->refreshAll();
        $this->comment('Rastreios atualizados com sucesso!');
    }
}
