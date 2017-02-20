<?php namespace Core\Console\Commands;

use Illuminate\Console\Command;
use Core\Http\Controllers\Stock\RemovalController;
use Core\Models\Stock\Removal;

class RefreshStockRemoval extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:stockremoval';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica se os produtos da retirada foram enviados e atualiza';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $removals = Removal::whereNull('closed_at')->get();

        foreach ($removals as $removal) {
            $return = with(new RemovalController())->refresh($removal->id);
            $this->comment($return);
        }
    }
}
