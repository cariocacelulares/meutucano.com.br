<?php namespace Gamification\Models;

/**
 * Class Tarefa
 * @package Gamification\Models
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