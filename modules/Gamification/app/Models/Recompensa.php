<?php namespace Gamification\Models;

/**
 * Class Recompensa
 * @package Gamification\Models
 */
class Recompensa extends \Eloquent
{
    protected $table = 'gamification_recompensas';

    protected $fillable = [
        'id',
        'titulo',
        'valor',
        'nivel',
    ];
}
