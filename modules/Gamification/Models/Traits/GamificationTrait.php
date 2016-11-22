<?php namespace Modules\Gamification\Models\Traits;

use Modules\Gamification\Models\Gamification;
use Modules\Gamification\Models\UsuarioConquista;
use Modules\Gamification\Models\UsuarioTarefa;
use Modules\Gamification\Models\Voto;

/**
 * Trait GamificationTrait
 * @package Modules\Gamification\Models\Traits
 */
trait GamificationTrait
{
    public function gamification()
    {
        return $this->hasOne(Gamification::class);
    }

    public function conquistas()
    {
        return $this->hasMany(UsuarioConquista::class);
    }

    public function tarefas()
    {
        return $this->hasMany(UsuarioTarefa::class);
    }
    public function votos()
    {
        return $this->hasMany(Voto::class, 'candidato_id');
    }
}