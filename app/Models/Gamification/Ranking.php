<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;

/**
 * Class Ranking
 * @package App\Models\Gamification
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