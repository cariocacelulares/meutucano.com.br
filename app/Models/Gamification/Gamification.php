<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;
use App\Models\Gamification\Voto;

/**
 * Class Gamification
 * @package App\Models\Gamification
 */
class Gamification extends \Eloquent
{
    protected $table = 'gamification';

    protected $fillable = [
        'usuario_id',
        'categoria_id',
        'avatar',
        'moedas',
        'pontos',
        'experiencia',
        'nivel',
    ];

    protected $appends = [
        'progresso',
    ];

    protected static function boot() {
        parent::boot();

        static::saving(function($gamification) {
            $gamification->nivel = (int)(\Config::get('gamification.level_constant') * sqrt($gamification->experiencia));

            $mes = date('m');
            $ano = date('Y');
            $ranking = Ranking
                ::where('usuario_id', '=', $gamification->usuario_id)
                ->where('mes', '=', $mes)
                ->where('ano', '=', $ano)
                ->first();

            if (!$ranking) {
                $ranking = Ranking::create([
                    'usuario_id' => $gamification->usuario_id,
                    'mes' => $mes,
                    'ano' => $ano,
                ]);
            }

            $ranking->save();
        });
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
    }

    public function votos()
    {
        return $this->belongsTo(Voto::class, 'usuario_id', 'candidato_id');
    }

    public function getAvatarAttribute($avatar)
    {
        if ($avatar)
            return $avatar;
        else
            return 'images/gamification/default-profile.gif';
    }

    public function getProgressoAttribute()
    {
        $levels = \Config::get('gamification.levels');

        if (!$this->nivel || !$this->experiencia) {
            return 0;
        }

        $xpAtual = $levels[$this->nivel];
        $xpProximo = $levels[$this->nivel + 1];
        $diferenca = $xpProximo - $xpAtual;

        $progresso = $this->experiencia - $xpAtual;
        $progresso = (100 * $progresso) / $diferenca;

        return (int)$progresso;
    }
}