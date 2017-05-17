<?php namespace Core\Models;

class TrackingCode extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'shipment_method_slug',
        'prefix',
        'current',
        'last',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shipmentMethod()
    {
        return $this->belongsTo(ShipmentMethod::class);
    }
}
