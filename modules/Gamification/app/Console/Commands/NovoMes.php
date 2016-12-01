<?php namespace Gamification\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Usuario\Usuario;
use Gamification\Models\Ranking;
use Gamification\Models\Conquista;
use Gamification\Models\UsuarioConquista;

class NovoMes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gamification:mes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atribui a conquista ao vencedor do mes anterior e gera o novo ranking';

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
            $this->comment('Impossivel fazer essa acao, o gamification esta desativado! (em config\gamification.php ou .env GAMIFICATION_ATIVO)');
        } else {
            $mes = date('m');
            $ano = date('Y');

            // Gera o ranking do mês atual
            $usuarios = Usuario::all();
            foreach ($usuarios as $usuario) {
                $rank = Ranking::firstOrCreate([
                    'usuario_id' => $usuario->id,
                    'mes' => $mes,
                    'ano' => $ano
                ]);

                if ($rank->wasRecentlyCreated) {
                    $rank->save();
                }
            }

            $mes--;
            if ($mes == 0) {
                $mes = 12;
                $ano--;
            } else if ($mes == 13) {
                $mes = 1;
                $ano++;
            }

            // Atribui a conquista de vencedor do ultimo mes
            $ranking = Ranking
                ::where('mes', '=', $mes)
                ->where('ano', '=', $ano)
                ->orderBy('pontos', 'DESC')
                ->orderBy('tarefas', 'DESC')
                ->orderBy('votos', 'DESC')
                ->orderBy('usuario_id', 'ASC')
                ->first();

            if ($ranking && $conquista = Conquista::find(3)) {
                UsuarioConquista::create(array(
                    'usuario_id' => $ranking->usuario_id,
                    'conquista_id' => $conquista->id
                ));
            }
        }
    }
}