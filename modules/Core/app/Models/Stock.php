<?php namespace Core\Models;

/**
 * Stock model
 * @package Core\Models;
 */
class Stock extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'title',
        'priority'
    ];

    /**
     * @var boolean
     */
    public $timestamps = false;
}