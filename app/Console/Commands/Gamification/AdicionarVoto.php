<?php namespace App\Console\Commands\Gamification;

use Illuminate\Console\Command;
use App\Models\Usuario\Usuario;
use App\Models\Gamification\Voto;

class AdicionarVoto extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gamification:voto {candidato} {eleitor}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adiciona um voto a um usuario';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $candidato = (int) $this->argument('candidato');
        $eleitor = (int) $this->argument('eleitor');

        if (Usuario::find($candidato) && Usuario::find($eleitor)) {
            $voto = Voto::create([
                'candidato_id' => $candidato,
                'eleitor_id' => $eleitor,
            ]);
            $voto->save();
            $this->comment('Voto adicionado!');
        } else {
            $this->comment('Nao foi possivel adicionar o voto. Cadidato ou eleitor nao encontrado!');
        }
    }
}