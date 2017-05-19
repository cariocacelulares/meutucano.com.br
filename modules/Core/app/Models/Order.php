<?php namespace Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class Order extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    const STATUS_PENDING  = 0;
    const STATUS_PAID     = 1;
    const STATUS_INVOICED = 2;
    const STATUS_SHIPPED  = 4;
    const STATUS_COMPLETE = 3;
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
        'shipment_method_slug',
        'payment_method_slug',
        'installments',
        'api_code',
        'marketplace_slug',
        'taxes',
        'discount',
        'total',
        'estimated_delivery',
        'status',
        'cancel_protocol',
        'holded',
        'refunded',
        'priority',
    ];

    /**
     * @return array
     */
    protected $appends = [
        'status_cast',
        'subtotal',
        'can_hold',
        'can_prioritize',
        'can_approve',
        'can_cancel',
        'count_on_stock'
      ];

    /**
     * @return array
     */
    protected $casts = [
        'taxes'         => 'float',
        'discount'      => 'float',
        'subtotal'      => 'float',
        'total'         => 'float',
        'shipment_cost' => 'float'
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
    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderProductsGrouped()
    {
        return $this->hasMany(OrderProduct::class)
            ->selectRaw('order_products.*, count(*) as quantity, (count(*) * price) as subtotal')
            ->groupBy('product_sku', 'price');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shipmentMethod()
    {
        return $this->belongsTo(ShipmentMethod::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function marketplace()
    {
        return $this->belongsTo(Marketplace::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function shipments()
    {
        return $this->hasMany(OrderShipment::class);
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
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function calls()
    {
        return $this->hasMany(OrderCall::class)->orderBy('created_at');
    }

    /**
     * @return string
     */
    public function getStatusCastAttribute()
    {
        switch ($this->status) {
            case self::STATUS_PENDING:
                return 'Pendente';
            case self::STATUS_PAID:
                return 'Pago';
            case self::STATUS_INVOICED:
                return 'Faturado';
            case self::STATUS_SHIPPED:
                return 'Em transporte';
            case self::STATUS_COMPLETE:
                return 'Completo';
            case self::STATUS_CANCELED:
                return 'Cancelado';
            case self::STATUS_RETURNED:
                return 'Retornado';
        }
    }

    /**
     * Return subtotal from order
     *
     * @return float
     */
    public function getSubtotalAttribute()
    {
        return $this->total + $this->taxes - $this->discount;
    }

    /**
     * Define if an order can be holded
     *
     * @return boolean
     */
    public function getCanHoldAttribute()
    {
        if (in_array($this->status, [self::STATUS_PENDING, self::STATUS_PAID])) {
            return true;
        }

        return false;
    }

    /**
     * Defide if a order can be prioritized
     *
     * @return boolean
     */
    public function getCanPrioritizeAttribute()
    {
        if (in_array($this->status, [self::STATUS_PENDING, self::STATUS_PAID])) {
            return true;
        }

        return false;
    }

    /**
     * Define if an order can be approved
     *
     * @return boolean
     */
    public function getCanApproveAttribute()
    {
        if (in_array($this->status, [self::STATUS_PENDING])) {
            return true;
        }

        return false;
    }

    /**
     * Define if an order can be canceled
     *
     * @return boolean
     */
    public function getCanCancelAttribute()
    {
        if (in_array($this->status, [self::STATUS_PENDING, self::STATUS_PAID])) {
            return true;
        }

        return false;
    }

    /**
     * Define if an order counts on stock
     */
    public function getCountOnStockAttribute()
    {
        if (in_array($this->status, [
            self::STATUS_INVOICED,
            self::STATUS_SHIPPED,
            self::STATUS_COMPLETE
        ])) {
            return true;
        }

        return false;
    }
}
