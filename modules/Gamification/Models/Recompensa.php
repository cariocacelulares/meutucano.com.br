<?php namespace Modules\Gamification\Models;

/**
 * Class Recompensa
 * @package Modules\Gamification\Models
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