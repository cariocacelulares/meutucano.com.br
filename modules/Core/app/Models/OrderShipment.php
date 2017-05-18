<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class OrderShipment extends \Eloquent
{
    use RevisionableTrait;

    const STATUS_PENDING  = 0;
    const STATUS_NORMAL   = 1;
    const STATUS_LATE     = 2;
    const STATUS_LOSS     = 3;
    const STATUS_COMPLETE = 4;
    const STATUS_RETURNED = 5;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'order_id',
        'shipment_method_slug',
        'sent_at',
        'tracking_code',
        'cost',
        'deadline',
        'status',
        'note',
    ];

    /**
     * @var array
     */
    protected $hidden = [
        'monitoredByUser',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'cost' => 'float'
    ];

    /**
     * @return array
     */
    protected $appends = [
        'monitored',
        'status_cast',
        'print_url'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function($orderShipment) {
            $orderShipment->tracking_code = shipment($orderShipment)
                ->generateTrackingCode();
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shipmentMethod()
    {
        return $this->belongsTo(ShipmentMethod::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function issue()
    {
        return $this->hasOne(OrderShipmentIssue::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolution()
    {
        return $this->hasOne(OrderShipmentDevolution::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function logistic()
    {
        return $this->hasOne(OrderShipmentLogistic::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function monitors()
    {
        return $this->hasMany(OrderShipmentMonitor::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function history()
    {
        return $this->hasMany(OrderShipmentHistory::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function monitoredByUser()
    {
        return $this->hasMany(OrderShipmentMonitor::class)
            ->where('user_id', \Auth::user()->id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function getMonitoredAttribute()
    {
        if (!array_key_exists('monitoredByUser', $this->relations)) {
            return;
        }

        $related = $this->getRelation('monitoredByUser')->first();
        return $related ? true : false;
    }

    /**
     * @return string
     */
    public function getStatusCastAttribute()
    {
        switch($this->status) {
            case self::STATUS_PENDING:
                return 'Pendente';
            case self::STATUS_NORMAL:
                return 'Normal';
            case self::STATUS_LATE:
                return 'Atrasado';
            case self::STATUS_LOSS:
                return 'Extraviado';
            case self::STATUS_COMPLETE:
                return 'Entregue';
            case self::STATUS_RETURNED:
                return 'Devolvido';
        }
    }

    /**
     * Return print URL for Model
     *
     * @return string
     */
    public function getPrintUrlAttribute()
    {
        return url("api/orders/shipments/{$this->id}/label?token=" . \JWTAuth::getToken());
    }
}
