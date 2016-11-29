<?php namespace Modules\Meta\Models;

/**
 * Class MetaAno
 * @package Modules\Meta\Models
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