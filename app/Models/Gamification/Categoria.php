<?php namespace App\Models\Gamification;

use App\Models\Gamification\Tarefa;

/**
 * Class Categoria
 * @package App\Models\Gamification
 */
class Categoria extends \Eloquent
{
    protected $table = 'gamification_categorias';

    protected $fillable = [
        'titulo'
    ];

    public function tarefas()
    {
        return $this->belongsToMany(Tarefa::class, 'gamification_tarefas_categorias', 'categoria_id', 'tarefa_id');
    }
}