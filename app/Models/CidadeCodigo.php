<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class CidadeCodigo
 * @package App\Models
 */
class CidadeCodigo extends \Eloquent
{

    /**
     * @var array
     */
    protected $fillable = [
        'codigo',
        'uf',
        'cidade',
    ];
}
