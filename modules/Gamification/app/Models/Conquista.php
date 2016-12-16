<?php namespace Gamification\Models;

/**
 * Class Conquista
 * @package Gamification\Models
 */
class Conquista extends \Eloquent
{
    protected $table = 'gamification_conquistas';

    protected $fillable = [
        'titulo',
        'slug',
        'icone',
        'tarefa_id',
        'quantidade',
        'tempo',
    ];

    public function tarefa()
    {
        return $this->hasOne(Tarefa::class);
    }
}
