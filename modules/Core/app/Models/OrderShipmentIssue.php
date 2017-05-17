<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class OrderShipmentIssue extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'order_shipment_id',
        'carrier_code',
        'reason',
        'status',
        'payed_at',
        'payed_value',
        'action',
        'note',
    ];

    /**
     * @return array
     */
    protected $appends = [
        'reason_cast'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'payed_value' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shipment()
    {
        return $this->belongsTo(OrderShipment::class);
    }

    /**
     * @return string
     */
    public function getReasonCastAttribute()
    {
        switch ($this->reason) {
            case 0:
                return 'Outro';
            case 2:
                return 'Atraso';
            case 3:
                return 'Extravio';
        }
    }
}
