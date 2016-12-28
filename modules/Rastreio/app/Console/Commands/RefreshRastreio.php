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
    protected $signature = 'refresh:rastreio {codigo}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza um rastreio';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $codigo = $this->argument('codigo');

        if ($codigo) {
            $rastreio = Rastreio::where('rastreio', '=', $codigo)->first();

            if ($rastreio) {
                $return = with(new RastreioController())->refresh($rastreio);

                if (json_decode($return)) {
                    $this->comment("{$return->rastreio}: {$return->status_description} - {$return->prazo} dias");
                } else {
                    $this->comment($return);
                }
            } else {
                $this->comment("Não foi possível encontrar um rastreio com o código '{$codigo}'");
            }
        } else {
            throw new \Exception('Um código de rastreio válido precisa ser passado como parâmetro', 1);
        }
    }
}
