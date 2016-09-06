<?php namespace App\Models\Meta;

/**
 * Class MetaAno
 * @package App\Models\Meta
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