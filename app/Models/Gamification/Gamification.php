<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;

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
        'progresso'
    ];

    protected static function boot() {
        parent::boot();

        static::saving(function($gamification) {
            $gamification->nivel = (int)(\Config::get('gamification.level_constant') * sqrt($gamification->experiencia));
        });
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
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