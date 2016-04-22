<?php namespace App\Models;

/**
 * Class MetaAno
 * @package App\Models
 */
class MetaAno extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'ano';

    /**
     * @var string
     */
    protected $table = 'meta_ano';

    /**
     * @var bool
     */
    public $timestamps = false;
}
