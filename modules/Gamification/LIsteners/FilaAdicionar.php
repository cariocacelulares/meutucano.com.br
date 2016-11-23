<?php namespace Modules\Gamification\Listeners;

use Modules\Gamification\Events\TarefaRealizada;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Modules\Gamification\Models\Fila;
use Illuminate\Events\Dispatcher;

class FilaAdicionar
{

    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            TarefaRealizada::class,
            'Modules\Gamification\Listeners\FilaAdicionar@onTarefaRealizada'
        );
    }

    /**
     * Handle the event.
     *
     * @param  TarefaRealizada  $event
     * @return void
     */
    public function onTarefaRealizada(TarefaRealizada $event)
    {
        $usuario_id = $event->usuario_id;
        $tarefa_id = $event->tarefa_id;
        \Log::debug('Gamification: listener AdicionarFila ativado', ['usuario' => $usuario_id, 'tarefa' => $tarefa_id]);

        if ($tarefa_id && $usuario_id) {
            Fila::create([
                'usuario_id' => $usuario_id,
                'tarefa_id' => $tarefa_id
            ]);
        } else {
            \Log::warning('Gamification: não foi possível adicionar na fila. A tarefa ou usuário não foi encontrada.', ['usuario' => $usuario_id, 'tarefa' => $tarefa_id]);
        }
    }
}
