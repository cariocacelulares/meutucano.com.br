<?php namespace App\Http\Controllers\Gamification;

use App\Http\Controllers\Rest\RestResponseTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Usuario;
use App\Models\Gamification\Gamification;
use App\Models\Gamification\UsuarioTarefa;
use App\Models\Gamification\Voto;
use App\Models\Gamification\Ranking;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

/**
 * Class GamificationController
 * @package App\Http\Controllers\Gamification
 */
class GamificationController extends Controller
{
    use RestResponseTrait;

    public function perfil($usuario_id = false)
    {
        try {
            if (!$usuario_id) {
                $usuario_id = JWTAuth::parseToken()->authenticate()->id;
            }

            $usuario = Usuario
                ::where('id', '=', $usuario_id)
                ->with([
                    'gamification',
                    'categoria',
                    'conquistas',
                    'tarefas',
                    'votos',
                ])
                ->first();

            if (!$usuario)
                return $this->notFoundResponse();

            $mes = date('m');
            $tarefas = UsuarioTarefa
                ::selectRaw('DAY(created_at) AS dia, COUNT(*) as total')
                ->where('usuario_id', '=', $usuario->id)
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
            $grafico = array_values($grafico);

            return $this->showResponse(['usuario' => $usuario, 'grafico' => $grafico]);
        } catch (\Exception $e) {
            return $this->clientErrorResponse($e->getMessage());
        }
    }

    public function ranking()
    {
        try {
            /*
            SELECT
                g.id,
                u.name,
                g.avatar,
                g.nivel,
                g.moedas,
                g.experiencia,
                g.nivel,
                (
                    SELECT SUM(t.pontos)
                    FROM gamification_usuario_tarefas t
                    WHERE t.usuario_id = g.usuario_id
                        AND t.created_at >= '2016-10-01 00:00:00' AND t.created_at <= '2016-10-31 23:59:59'
                ) AS pontos,
                (
                    SELECT COUNT(*)
                    FROM gamification_votos v
                    WHERE v.candidato_id = g.usuario_id
                        AND v.created_at >= '2016-10-01 00:00:00' AND v.created_at <= '2016-10-31 23:59:59'
                ) AS  votos
            FROM gamification g
                JOIN usuarios u ON g.usuario_id = u.id
             */

            /*$jogadores = Gamification
                ::with('usuario')
                ->orderBy('pontos', 'DESC')
                ->orderBy('experiencia', 'DESC')
                ->orderBy('moedas', 'DESC')
                ->orderBy('created_at', 'ASC')
                ->get()->toArray();

            $mes = date('m');
            $ano = date('Y');
            $ultimoDia = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);

            $ranking = [];
            foreach ($jogadores as $indice => $jogador) {
                $jogador['votos_total'] = Voto
                    ::where('candidato_id', '=', $jogador['usuario_id'])
                    ->where('created_at', '>=', "{$ano}-{$mes}-01 00:00:00")
                    ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                    ->count();

                 $jogador['pontos'] = (int) with(UsuarioTarefa
                    ::selectRaw('SUM(pontos) AS pontos')
                    ->where('usuario_id', '=', $jogador['usuario_id'])
                    ->where('created_at', '>=', "{$ano}-{$mes}-01 00:00:00")
                    ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                    ->first())->pontos;

                $ranking[$indice] = $jogador;
            }*/
            $mes = date('m');
            $ano = date('Y');
            $ranking = Ranking
                ::where('mes', '=', $mes)
                ->where('ano', '=', $ano)
                ->get();

            return $this->showResponse($ranking);
        } catch (\Exception $e) {
            return $this->clientErrorResponse($e->getMessage());
        }
    }
}