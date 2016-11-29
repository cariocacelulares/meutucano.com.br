<?php namespace Modules\Gamification\Models;

use App\Models\Usuario\Usuario;
use Modules\Gamification\Models\Tarefa;

/**
 * Class Fila
 * @package Modules\Gamification\Models
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