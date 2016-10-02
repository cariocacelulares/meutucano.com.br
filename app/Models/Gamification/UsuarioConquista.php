<?php namespace App\Models\Gamification;

use Carbon\Carbon;
use App\Models\Usuario\Usuario;
use App\Models\Gamification\Categoria;

/**
 * Class UsuarioConquista
 * @package App\Models\Gamification
 */
class UsuarioConquista extends \Eloquent
{
    protected $table = 'gamification_usuario_conquistas';

    protected $fillable = [
        'usuario_id',
        'conquista_id',
    ];

    protected $with = [
        'conquista'
    ];

    protected $appends = [
        'created_at_readable',
        'updated_at_readable',
    ];

    public function conquista()
    {
        return $this->hasOne(Conquista::class, 'id', 'conquista_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    protected function getUpdatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}