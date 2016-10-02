<?php namespace App\Models\Gamification;

use App\Models\Gamification\Categoria;

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

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'gamification_tarefas_categorias', 'tarefa_id', 'categoria_id');
    }
}