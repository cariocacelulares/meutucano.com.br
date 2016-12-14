<?php namespace Gamification\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Gamification\Models\Fila;
use Gamification\Events\TarefaRealizada;

class FilaAdicionar
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            TarefaRealizada::class,
            '\Gamification\Events\Handlers\FilaAdicionar@onTarefaRealizada'
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