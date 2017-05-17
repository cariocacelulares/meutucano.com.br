<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class OrderShipmentLogistic extends \Eloquent
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
                return 'Defeito';
            case 1:
                return 'Arrependimento';
            case 2:
                return 'Duplicidade';
            case 3:
                return 'Produto divergente';
            case 4:
                return 'Outro';
        }
    }
}
