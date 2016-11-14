<?php namespace App\Models\Gamification;

/**
 * Class Tarefa
 * @package App\Models\Gamification
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