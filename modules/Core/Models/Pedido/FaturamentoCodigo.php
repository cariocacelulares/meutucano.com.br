<?php namespace Modules\Core\Models\Pedido;

/**
 * Class FaturamentoCodigo
 * @package Modules\Core\Models\Pedido
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
    protected $fillable = [
        'servico',
        'atual',
        'fim'
    ];
}