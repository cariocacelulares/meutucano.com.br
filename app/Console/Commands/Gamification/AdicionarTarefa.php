<?php namespace App\Console\Commands\Gamification;

use Illuminate\Console\Command;
use App\Models\Gamification\Tarefa;
use App\Models\Usuario\Usuario;
use App\Events\Gamification\TarefaRealizada;

class AdicionarTarefa extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gamification:tarefa {tarefa} {usuario}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adiciona uma tarefa a um usuario';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $ok = false;
        $usuario = (int) $this->argument('usuario');
        if ($usuario = Usuario::find($usuario)) {
            $tarefa = $this->argument('tarefa');

            if (is_numeric($tarefa)) {
                $tarefa = Tarefa::find($tarefa);
            } else {
                $tarefa = Tarefa::where('slug', '=', $tarefa)->first();
            }

            if ($tarefa) {
                \Log::debug('sdas', [$tarefa->toArray()]);
                \Event::fire(new TarefaRealizada($tarefa->slug, $usuario->id));
                $ok = true;
                $this->comment('Tarefa adiciona na fila!');
            }
        }

        if (!$ok) {
            $this->comment('Nao foi possivel encontrar a tarefa ou usuario!');
        }
    }
}