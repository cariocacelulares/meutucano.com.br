<?php namespace Gamification\Models\Traits;

use Gamification\Models\Gamification;
use Gamification\Models\UsuarioConquista;
use Gamification\Models\UsuarioTarefa;
use Gamification\Models\Voto;

/**
 * Trait GamificationTrait
 * @package Gamification\Models\Traits
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
