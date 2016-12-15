<?php namespace Gamification\Models;

use App\Models\Usuario\Usuario;
use Gamification\Models\Tarefa;

/**
 * Class Fila
 * @package Gamification\Models
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
