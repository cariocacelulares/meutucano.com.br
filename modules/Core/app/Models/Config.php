<?php namespace Core\Models;

/**
 * Config model
 * @package Core\Models;
 */
class Config extends \Eloquent
{
    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var string
     */
    protected $table = 'config';

    /**
     * @var string
     */
    protected $primaryKey = 'key';

    /**
     * @var array
     */
    protected $fillable = ['key', 'value'];

    /**
     * @var boolean
     */
    public $timestamps = false;
}