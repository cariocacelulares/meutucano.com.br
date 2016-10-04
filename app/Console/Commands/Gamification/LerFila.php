<?php namespace App\Console\Commands\Gamification;

use Illuminate\Console\Command;
use App\Models\Gamification\Fila;
use App\Models\Gamification\Tarefa;
use App\Models\Gamification\UsuarioTarefa;

class LerFila extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gamification:fila';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza o gamification baseado na fila';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($fila = Fila::orderBy('created_at', 'DESC')->first()) {
            if ($tarefa = Tarefa::find($fila->tarefa_id)) {
                UsuarioTarefa::create([
                    'usuario_id' => $fila->usuario_id,
                    'tarefa_id' => $fila->tarefa_id,
                    'experiencia' => $tarefa->experiencia,
                    'pontos' => $tarefa->pontos,
                    'moedas' => $tarefa->moedas,
                ]);
                $fila->delete();
            }
        }
    }
}