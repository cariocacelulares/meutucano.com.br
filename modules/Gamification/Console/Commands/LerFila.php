<?php namespace Modules\Gamification\Console\Commands;

use Illuminate\Console\Command;
use Modules\Gamification\Models\Fila;
use Modules\Gamification\Models\Tarefa;
use Modules\Gamification\Models\UsuarioTarefa;

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
        try {
            $ativo = (bool) \Config::get('gamification.ativo');
        } catch(\Exception $ex) {
            $ativo = false;
        }

        if (!$ativo) {
            $this->comment('Impossivel ler a fila, o gamification esta desativado! (em config\gamification.php ou .env GAMIFICATION_ATIVO)');
        } else {
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
}