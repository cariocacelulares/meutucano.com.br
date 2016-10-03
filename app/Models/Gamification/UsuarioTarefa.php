<?php namespace App\Models\Gamification;

use Carbon\Carbon;
use App\Models\Usuario\Usuario;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class UsuarioTarefa
 * @package App\Models\Gamification
 */
class UsuarioTarefa extends \Eloquent
{
    protected $table = 'gamification_usuario_tarefas';

    protected $fillable = [
        'usuario_id',
        'tarefa_id',
        'pontos',
        'moedas',
    ];

    protected $with = [
        'tarefa'
    ];

    protected $appends = [
        'created_at_readable',
        'updated_at_readable',
    ];

    protected static function boot() {
        parent::boot();

        static::creating(function($usuarioTarefa) {
            // Cria / atualiza a tabela gamification
            if ($gamification = Gamification::where('usuario_id', '=', $usuarioTarefa->usuario_id)->first()) {
                $gamification->experiencia = $gamification->experiencia + $usuarioTarefa->pontos;
                $gamification->moedas = $gamification->moedas + $usuarioTarefa->moedas;
                $gamification->save();
            } else {
                $gamification = Gamification::create([
                    'usuario_id' => $usuarioTarefa->usuario_id,
                    'experiencia' => $usuarioTarefa->pontos,
                    'moedas' => $usuarioTarefa->moedas,
                    'nivel' => 1
                ]);
            }

            // Ranking
            $mes = date('m');
            $ano = date('Y');
            $ranking = Ranking
                ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                ->where('mes', '=', $mes)
                ->where('ano', '=', $ano)
                ->first();

            if (!$ranking) {
                $ranking = new Ranking([
                    'usuario_id' => $usuarioTarefa->usuario_id,
                    'mes' => $mes,
                    'ano' => $ano,
                ]);
            }

            $ultimoDia = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);
            $tarefas = UsuarioTarefa
                ::selectRaw('SUM(pontos) AS pontos, COUNT(*) as total')
                ->where('usuario_id', '=', $usuarioTarefa->usuario_id)
                ->where('created_at', '>=', "{$ano}-{$mes}-01 00:00:00")
                ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                ->first()->toArray();

            $ranking->pontos = (int)$tarefas['pontos'];
            $ranking->tarefas = (int)$tarefas['total'];
            $ranking->save();

            // Conquistas
            $conquistas = Conquista::where('tarefa_id', '=', $usuarioTarefa->tarefa_id)->get();
            $dia = date('d');
            $mes = date('m');
            $ano = date('Y');

            foreach ($conquistas as $conquista) {
                $total = null;
                if ($conquista->tempo == 0) {
                    $total = UsuarioTarefa
                        ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                        ->where('tarefa_id', '=', $usuarioTarefa->tarefa_id)
                        ->where('created_at', 'LIKE', "{$ano}-{$mes}-{$dia}%")
                        ->count();
                } else if ($conquista->tempo == 1) {
                    $hoje = Carbon::now();
                    $diaDaSemana = $hoje->dayOfWeek;
                    $primeiroDia = $hoje->subDays($diaDaSemana);
                    $ultimoDia = $hoje->addDays(6 - $diaDaSemana);

                    $total = UsuarioTarefa
                        ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                        ->where('tarefa_id', '=', $usuarioTarefa->tarefa_id)
                        ->where('created_at', '>=', "{$ano}-{$mes}-{$primeiroDia} 00:00:00")
                        ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                        ->count();
                } else if ($conquista->tempo == 2) {
                    $total = UsuarioTarefa
                        ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                        ->where('tarefa_id', '=', $usuarioTarefa->tarefa_id)
                        ->where('created_at', 'LIKE', "{$ano}-{$mes}-%")
                        ->count();
                } else if ($conquista->tempo == 3) {
                    $total = UsuarioTarefa
                        ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                        ->where('tarefa_id', '=', $usuarioTarefa->tarefa_id)
                        ->count();
                }

                if ($total !== null) {
                    $total = $total + 1;
                    if ($total >= $conquista->quantidade) {
                        $existentes = 0;

                        if ($conquista->tempo == 0) {
                            $existentes = UsuarioConquista
                                ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                                ->where('conquista_id', '=', $conquista->id)
                                ->where('created_at', 'LIKE', "{$ano}-{$mes}-{$dia}%")
                                ->count();
                        } else if ($conquista->tempo == 1) {
                            $existentes = UsuarioConquista
                                ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                                ->where('conquista_id', '=', $conquista->id)
                                ->where('created_at', '>=', "{$ano}-{$mes}-{$primeiroDia} 00:00:00")
                                ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                                ->count();
                        } else if ($conquista->tempo == 2) {
                            $existentes = UsuarioConquista
                                ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                                ->where('conquista_id', '=', $conquista->id)
                                ->where('created_at', 'LIKE', "{$ano}-{$mes}-%")
                                ->count();
                        } else if ($conquista->tempo == 3) {
                            $existentes = UsuarioConquista
                                ::where('usuario_id', '=', $usuarioTarefa->usuario_id)
                                ->where('conquista_id', '=', $conquista->id)
                                ->count();
                        }

                        if ($total >= ($existentes * $conquista->quantidade) + $conquista->quantidade) {
                            UsuarioConquista::create([
                                'usuario_id' => $usuarioTarefa->usuario_id,
                                'conquista_id' => $conquista->id,
                            ]);
                        }
                    }
                }
            }
        });
    }

    public function tarefa()
    {
        return $this->hasOne(Tarefa::class, 'id', 'tarefa_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    protected function getCreatedAtReadableAttribute()
    {
        if (!$this->created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    protected function getUpdatedAtReadableAttribute()
    {
        if (!$this->created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}