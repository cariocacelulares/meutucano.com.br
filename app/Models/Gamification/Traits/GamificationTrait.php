<?php namespace App\Models\Gamification\Traits;

use App\Models\Gamification\Gamification;
use App\Models\Gamification\UsuarioConquista;
use App\Models\Gamification\UsuarioTarefa;
use App\Models\Gamification\Voto;

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