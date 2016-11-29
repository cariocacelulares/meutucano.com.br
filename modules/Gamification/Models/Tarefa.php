<?php namespace Modules\Gamification\Models;

/**
 * Class Tarefa
 * @package Modules\Gamification\Models
 */
class Tarefa extends \Eloquent
{
    protected $table = 'gamification_tarefas';

    protected $fillable = [
        'titulo',
        'slug',
        'moedas',
        'pontos',
    ];
}