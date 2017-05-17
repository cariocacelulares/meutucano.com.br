<?php namespace Core\Models;

class ShipmentMethod extends \Eloquent
{
    /**
     * @var string
     */
    public $primaryKey = 'slug';

    /**
     * @var boolean
     */
    public $incrementing = false;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'title',
        'service',
        'api_code'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function trackingCodes()
    {
        return $this->hasMany(TrackingCode::class);
    }

    /**
     * Return first valid Tracking Code
     *
     * @return TrackingCode
     */
    public function validTrackingCode()
    {
        return $this->trackingCodes()
            ->where('last', '>', 'current')
            ->orderBy('created_at')
            ->first();
    }
}
