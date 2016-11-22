<?php namespace Modules\Gamification\Console\Commands;

use Illuminate\Console\Command;
use Modules\Gamification\Models\Tarefa;
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
            \Event::fire(new TarefaRealizada($this->argument('tarefa'), $usuario->id));
            $ok = true;
            $this->comment('Tarefa adiciona na fila!');
        }

        if (!$ok) {
            $this->comment('Nao foi possivel encontrar a tarefa ou usuario!');
        }
    }
}