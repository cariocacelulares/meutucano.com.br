<?php namespace App\Events\Gamification;

use Illuminate\Queue\SerializesModels;
use App\Models\Gamification\Tarefa;

class TarefaRealizada extends \Event
{
    use SerializesModels;

    public $tarefa_id;
    public $usuario_id;

    public function __construct($tarefa_slug, $usuario_id = false)
    {
        \Log::debug('Evento TarefaRealizada disparado');

        if ($tarefa = Tarefa::where('slug', '=', $tarefa_slug)->first()) {
            $this->tarefa_id = $tarefa->id;
        }

        if (!$usuario_id) {
            $this->usuario_id = getCurrentUserId();
        } else {
            $this->usuario_id = $usuario_id;
        }
    }
}