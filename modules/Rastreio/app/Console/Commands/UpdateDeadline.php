<?php namespace Rastreio\Console\Commands;

use Illuminate\Console\Command;
use Rastreio\Http\Controllers\RastreioController;
use Rastreio\Models\Rastreio;

class UpdateDeadline extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rastreio:deadline {codigos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza o prazo de um ou mais rastreios';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $codigos = $this->argument('codigos');
        $codigos = explode(',', $codigos);

        foreach ($codigos as $codigo) {
            $rastreio = Rastreio::where('rastreio', '=', trim($codigo))->first();

            if ($rastreio) {
                $return = with(new RastreioController())->setDeadline($rastreio);

                if (strstr(get_class($return), 'JsonResponse') && json_decode($return->content())) {
                    $return = json_decode($return->content())->data;
                    $this->comment("{$return->rastreio}: {$return->prazo} dias");
                } else {
                    $this->comment($return);
                }
            } else {
                $this->comment("Não foi possível encontrar um rastreio com o código '{$codigo}'");
            }
        }
    }
}
