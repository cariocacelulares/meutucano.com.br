<?php namespace Core\Models;

use Rastreio\Models\Rastreio;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class Order extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    const STATUS_PENDING  = 0;
    const STATUS_PAID     = 1;
    const STATUS_INVOICED = 2;
    const STATUS_COMPLETE = 3;
    const STATUS_SHIPPED  = 4;
    const STATUS_CANCELED = 5;
    const STATUS_RETURNED = 6;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'customer_address_id',
        'shipment_cost',
        'shipment_method',
        'payment_method',
        'installments',
        'api_code',
        'marketplace',
        'total',
        'estimated_delivery',
        'status',
        'cancel_protocol',
        'holded',
        'refunded',
        'priority',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\hasMany
     */
    public function invoices()
    {
        return $this->hasMany(OrderInvoice::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function taxes()
    {
        return $this->hasOne(OrderTax::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(OrderProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function shipments()
    {
        return $this->hasMany(Rastreio::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function customerAddress()
    {
        return $this->belongsTo(CustomerAddress::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(OrderComment::class)->orderBy('created_at');
    }

    /**
     * Define if a order can be holded
     *
     * @return boolean
     */
    public function getCanHold()
    {
        if (in_array($this->status, [0, 1])) {
            return true;
        }

        return false;
    }

    /**
     * Defide if a order can be prioritized
     *
     * @return boolean
     */
    public function getCanPrioritize()
    {
        if (in_array($this->status, [0, 1])) {
            return true;
        }

        return false;
    }

    /**
     * Define if a order can be canceled
     *
     * @return boolean
     */
    public function getCanCancel()
    {
        if (in_array($this->status, [0, 1])) {
            return true;
        }

        return false;
    }
}
