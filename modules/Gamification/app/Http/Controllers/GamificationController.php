<?php namespace Gamification\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestResponseTrait;
use App\Models\Usuario\Usuario;
use Gamification\Models\Gamification;
use Gamification\Models\UsuarioTarefa;
use Gamification\Models\UsuarioConquista;
use Gamification\Models\Voto;
use Gamification\Models\Ranking;

/**
 * Class GamificationController
 * @package Gamification\Http\Controllers
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

        $days = range(1, date('d'));
        $grafico = array_fill_keys(array_keys(array_flip($days)), 0);
        foreach ($tarefas as $tarefa) {
            $grafico[$tarefa['dia']] = $tarefa['total'];
        }

        return array_values($grafico);
    }

    public function show($id = false)
    {
        if (!$id) {
            $id = getCurrentUserId();
        }

        if ($data = Gamification::find($id)) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
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
                $recursos['tarefas'] = function ($query) {
                    $query->orderBy('created_at', 'DESC');
                };
            }

            $usuario = Usuario
                ::where('id', '=', $usuario_id)
                ->with($recursos)
                ->first();

            if (!$usuario) {
                return $this->notFoundResponse();
            }

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
            if (Input::get('mes')) {
                $mes = explode('-', Input::get('mes'));
                $ano = $mes[1];
                $mes = $mes[0];
            } else {
                $mes = date('m');
                $ano = date('Y');
            }

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

    public function rankInfo()
    {
        try {
            $mesAtual = date('m');
            $anoAtual = date('Y');

            $datas = Ranking
                ::selectRaw("DISTINCT(CONCAT(mes, '-', ano)) as data, mes, ano")
                ->orderBy('ano', 'DESC')
                ->orderBy('mes', 'DESC')
                ->get();

            $list = [];
            foreach ($datas as $data) {
                if ($data->mes == $mesAtual && $data->ano == $anoAtual) {
                    $list[$data->data] = 'Mês Atual';
                } else {
                    $list[$data->data] = str_pad(\Config('core.meses')[(int)$data->mes], 2, '0') . '/' . $data->ano;
                }
            }

            $progress = 0;
            $toEnd = date('t') - date('d');
            $progress = (int) ((date('d') * 100) / date('t'));
            if (!$toEnd) {
                $toEnd = 24 - date('H');
                $progress = (int) ((date('H') * 100) / 24);
                if (!$toEnd) {
                    $toEnd = 60 - date('i');
                    $toEnd = $toEnd . ' mins';
                    $progress = (int) ((date('i') * 100) / 60);
                } else {
                    $toEnd = $toEnd . ' horas';
                }
            } else {
                $toEnd = $toEnd . ' dias';
            }

            return $this->listResponse([
                'list' => $list,
                'countdown' => [
                    'toEnd' => $toEnd,
                    'progress' => $progress
                ]
            ]);
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
