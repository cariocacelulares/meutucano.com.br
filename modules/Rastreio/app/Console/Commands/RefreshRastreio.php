<?php namespace Rastreio\Console\Commands;

use Illuminate\Console\Command;
use Rastreio\Http\Controllers\RastreioController;
use Rastreio\Models\Rastreio;

class RefreshRastreio extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:rastreio {codigos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza os rastreios';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $codigos = $this->argument('codigos');
        $codigos = explode(',', $codigos);
        $codigos = is_array($codigos) ? $codigos : [];

        $total = count($codigos);
        $i = 0;
        foreach ($codigos as $codigo) {
            $rastreio = Rastreio::where('rastreio', '=', $codigo)->first();

            if ($rastreio) {
                $return = with(new RastreioController())->refresh($rastreio);
                $i++;

                if (json_decode($return)) {
                    $this->comment("{$return->rastreio}: {$return->status_description} - {$return->prazo} dias");
                } else {
                    $this->comment($return);
                }
            } else {
                $this->comment("Não foi possível encontrar um rastreio com o código '{$codigo}'");
            }
        }

        $this->comment("{$i} de {$total} rastreios foram atualizados.");
    }
}
