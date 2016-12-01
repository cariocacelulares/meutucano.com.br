<?php namespace Gamification\Models;

use Carbon\Carbon;
use App\Models\Usuario\Usuario;

/**
 * Class Troca
 * @package Gamification\Models
 */
class Troca extends \Eloquent
{
    protected $table = 'gamification_trocas';

    protected $fillable = [
        'usuario_id',
        'recompensa_id',
        'valor',
        'status',
    ];

    protected $appends = [
        'created_at_readable',
        'updated_at_readable',
        'status_readable'
    ];

    protected $with = [
        'recompensa'
    ];

    public function recompensa()
    {
        return $this->hasOne(Recompensa::class, 'id', 'recompensa_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    protected function getStatusReadableAttribute()
    {
        return ($this->status === 1) ? 'Aprovado' : 'Pendente';
    }

    protected function getCreatedAtReadableAttribute()
    {
        if (!$this->created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    protected function getUpdatedAtReadableAttribute()
    {
        if (!$this->created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}