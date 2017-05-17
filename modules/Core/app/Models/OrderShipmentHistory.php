<?php namespace Core\Models;

class OrderShipmentHistory extends \Eloquent
{
    /**
     * @var string
     */
    protected $table = 'order_shipment_history';

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'order_shipment_id',
        'status',
        'date',
        'location',
        'zipcode',
        'action',
        'detail',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function shipment()
    {
        return $this->belongsTo(OrderShipment::class);
    }
}
