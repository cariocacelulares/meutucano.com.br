<?php namespace Core\Models\Additional;

class TrackingCode extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'service';

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
        'service',
        'prefix',
        'current',
        'end',
    ];
}
