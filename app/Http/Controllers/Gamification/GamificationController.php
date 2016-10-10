<?php namespace App\Http\Controllers\Gamification;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Usuario;
use App\Models\Gamification\Gamification;
use App\Models\Gamification\UsuarioTarefa;
use App\Models\Gamification\UsuarioConquista;
use App\Models\Gamification\Voto;
use App\Models\Gamification\Ranking;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

/**
 * Class GamificationController
 * @package App\Http\Controllers\Gamification
 */
class GamificationController extends Controller
{
    use RestResponseTrait;

    private function graficoTarefas($usuario_id)
    {
        $mes = date('m');
        $tarefas = UsuarioTarefa
            ::selectRaw('DAY(created_at) AS dia, COUNT(*) as total')
            ->where('usuario_id', '=', $usuario_id)
            ->where(DB::raw('MONTH(created_at)'), '=', $mes)
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy(DB::raw('DAY(created_at)'), 'ASC')
            ->get()->toArray();

        // Caso precisar o último dia do mês: cal_days_in_month(CAL_GREGORIAN, $mes, date('Y'))
        $days = range(1, date('d'));
        $grafico = array_fill_keys(array_keys(array_flip($days)), 0);
        foreach ($tarefas as $tarefa) {
            $grafico[$tarefa['dia']] = $tarefa['total'];
        }

        return array_values($grafico);
    }

    private function totalVotos($usuario_id)
    {
        return (int) Voto
            ::where('candidato_id', '=', $usuario_id)
            ->count();
    }

    private function conquistas($usuario_id)
    {
        $conquistas = UsuarioConquista
            ::where('usuario_id', '=', $usuario_id)
            ->groupBy('conquista_id')
            ->orderBy('conquista_id', 'ASC')
            ->orderBy('created_at', 'DESC')
            ->get();

        return $conquistas;
    }

    public function perfil($usuario_id = false)
    {
        try {
            $proprio = false;

            if (!$usuario_id) {
                $usuario_id = JWTAuth::parseToken()->authenticate()->id;
                $proprio = true;
            }

            $recursos = ['gamification'];

            if ($proprio) {
                $recursos['tarefas'] = function($query)
                {
                    $query->orderBy('created_at', 'DESC');
                };
            }

            $usuario = Usuario
                ::where('id', '=', $usuario_id)
                ->with($recursos)
                ->first();

            if (!$usuario)
                return $this->notFoundResponse();

            $grafico = $this->graficoTarefas($usuario->id);
            $votos = $this->totalVotos($usuario->id);
            $conquistas = $this->conquistas($usuario->id);

            return $this->showResponse([
                'usuario' => $usuario,
                'votos' => $votos,
                'conquistas' => $conquistas,
                'grafico' => $grafico
            ]);
        } catch (\Exception $e) {
            return $this->clientErrorResponse($e->getMessage());
        }
    }

    public function ranking()
    {
        try {
            $mes = date('m');
            $ano = date('Y');
            $ranking = Ranking
                ::where('mes', '=', $mes)
                ->where('ano', '=', $ano)
                ->orderBy('pontos', 'DESC')
                ->orderBy('tarefas', 'DESC')
                ->orderBy('votos', 'DESC')
                ->orderBy('usuario_id', 'ASC')
                ->get();

            return $this->showResponse($ranking);
        } catch (\Exception $e) {
            return $this->clientErrorResponse($e->getMessage());
        }
    }

    public function avatar($gamification_id)
    {
        if ($jogador = Gamification::find($gamification_id)) {
            $jogador->avatar = Input::get('avatar');
            $jogador->save();

            return $this->showResponse($jogador);
        } else {
            return $this->notFoundResponse();
        }
    }
}