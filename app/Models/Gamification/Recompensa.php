<?php namespace App\Models\Gamification;

/**
 * Class Recompensa
 * @package App\Models\Gamification
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