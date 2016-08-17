<?php namespace App\Models;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Produto
 * @package App\Models
 */
class Produto extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var string
     */
    protected $primaryKey = 'sku';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    protected $fillable = ['*'];
}
