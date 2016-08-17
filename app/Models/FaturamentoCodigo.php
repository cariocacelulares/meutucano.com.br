<?php namespace App\Models;

/**
 * Class FaturamentoCodigo
 * @package App\Models
 */
class FaturamentoCodigo extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'servico';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = ['*'];
}
