<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;

/**
 * Class Voto
 * @package App\Models\Gamification
 */
class Voto extends \Eloquent
{
    protected $table = 'gamification_votos';

    protected $fillable = [
        'eleitor_id',
        'candidato_id'
    ];

    protected static function boot() {
        parent::boot();

        static::creating(function($voto) {
            // Ranking
            $ranking = Ranking
                ::where('usuario_id', '=', $voto->candidato_id)
                ->where('mes', '=', date('m'))
                ->where('ano', '=', date('Y'))
                ->first();

            $ranking->votos = $ranking->votos + 1;
            $ranking->save();
        });
    }

    public function candidato()
    {
        return $this->belongsTo(Usuario::class, 'candidato_id', 'id');
    }

    public function eleitor()
    {
        return $this->belongsTo(Usuario::class, 'eleitor_id', 'id');
    }
}