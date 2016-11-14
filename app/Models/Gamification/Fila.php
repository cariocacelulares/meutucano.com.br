<?php namespace App\Models\Gamification;

use App\Models\Usuario\Usuario;
use App\Models\Gamification\Tarefa;

/**
 * Class Fila
 * @package App\Models\Gamification
 */
class Fila extends \Eloquent
{
    protected $table = 'gamification_fila';

    protected $fillable = [
        'usuario_id',
        'tarefa_id'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tarefa()
    {
        return $this->belongsTo(Tarefa::class);
    }
}