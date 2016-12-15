<?php namespace Gamification\Models;

use App\Models\Usuario\Usuario;
use Gamification\Models\Voto;

/**
 * Class Gamification
 * @package Gamification\Models
 */
class Gamification extends \Eloquent
{
    protected $table = 'gamification';

    protected $fillable = [
        'usuario_id',
        'avatar',
        'moedas',
        'pontos',
        'experiencia',
        'nivel',
    ];

    protected $appends = [
        'progresso',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($gamification) {
            $nivel = \Config::get('gamification.nivel');
            $gamification->nivel = $nivel($gamification->experiencia);

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
        if ($avatar) {
            return $avatar;
        } else {
            return 'images/gamification/default-profile.gif';
        }
    }

    public function getProgressoAttribute()
    {
        $nivel_exp = \Config::get('gamification.nivel_exp');

        if (!$this->nivel || !$this->experiencia) {
            return 0;
        }

        $xpAtual = $nivel_exp($this->nivel);
        $xpProximo = $nivel_exp($this->nivel + 1);
        $diferenca = $xpProximo - $xpAtual;

        $progresso = $this->experiencia - $xpAtual;
        $progresso = (100 * $progresso) / $diferenca;

        return (int)$progresso;
    }
}
