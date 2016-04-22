<?php namespace App\Models;

/**
 * Class Produto
 * @package App\Models
 */
class Produto extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'sku';

    /**
     * @var array
     */
    protected $fillable = [
        'sku',
        'titulo',
        'custo',
        'ncm',
        'ean',
    ];
}
