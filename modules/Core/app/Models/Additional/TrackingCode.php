<?php namespace Core\Models\Additional;

class TrackingCode extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'carries';

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
        'carries',
        'prefix',
        'current',
        'last',
    ];
}
