<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;

/**
 * Class voto
 * @package App\Models\Gamification
 */
class voto extends \Eloquent
{
    protected $table = 'gamification_votos';

    protected $fillable = [
        'eleitor',
        'candidato'
    ];

    public function candidato()
    {
        return $this->belongsTo(Usuario::class, 'candidato_id', 'id');
    }

    public function eleitor()
    {
        return $this->belongsTo(Usuario::class, 'eleitor_id', 'id');
    }
}