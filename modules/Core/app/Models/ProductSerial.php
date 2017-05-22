<?php namespace Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class ProductSerial extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'depot_product_id',
        'serial',
        'cost',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'in_stock'
    ];

    /**
     * @var array
     */
    protected $hidden = [
        'inStockRelation'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function depotProduct()
    {
        return $this->belongsTo(DepotProduct::class);
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
    public function withdrawProducts()
    {
        return $this->hasMany(DepotWithdrawProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function issue()
    {
        return $this->hasOne(ProductSerialIssue::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function defect()
    {
        return $this->hasOne(ProductDefect::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entrySerials()
    {
        return $this->hasMany(DepotEntryProductSerial::class);
    }

    /**
     * @return object
     */
    public function inStockRelation()
    {
        return $this->hasMany(OrderProduct::class)
            ->whereHas('order', function($query) {
                $query->whereIn('orders.status', [
                    Order::STATUS_INVOICED,
                    Order::STATUS_SHIPPED,
                    Order::STATUS_COMPLETE
                ]);
            })
            ->where('returned_at', null)
            ->orderBy('created_at', 'DESC');
    }

    /**
     * Set the serial
     *
     * @param string $imei upper and trim
     */
    public function setSerialAttribute($serial)
    {
        $this->attributes['serial'] = mb_strtoupper(trim($serial));
    }

    /**
     * Check if serial is in stock
     *
     * @return boolean
     */
    public function getInStockAttribute()
    {
        if (!array_key_exists('inStockRelation', $this->relations)) {
            return;
        }

        $lastOrderProduct = $this->getRelation('inStockRelation')->first();

        if ($this->trashed()) return false;

        if ($lastOrderProduct) {
            return false;
        }

        return true;
    }
}
