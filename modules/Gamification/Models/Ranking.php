<?php namespace Modules\Gamification\Models;

use App\Models\Usuario\Usuario;

/**
 * Class Ranking
 * @package Modules\Gamification\Models
 */
class Ranking extends \Eloquent
{
    protected $table = 'gamification_ranking';

    protected $fillable = [
        'usuario_id',
        'pontos',
        'votos',
        'tarefas',
        'mes',
        'ano',
    ];

    protected $with = [
        'jogador',
        'jogador.usuario'
    ];

    public function jogador()
    {
        return $this->belongsTo(Gamification::class, 'usuario_id', 'usuario_id');
    }
}