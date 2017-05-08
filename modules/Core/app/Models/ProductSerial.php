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
        return $this->hasMany(WithdrawProduct::class);
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
        return $this->hasMany(Serial::class);
    }

    /**
     * @return OrderProduct
     */
    public function lastOrderProduct()
    {
        return $this->orderProducts()->orderBy('created_at', 'desc')->first();
    }

    /**
     * Set the imei
     * @param string $imei upper and trim
     */
    public function setSerialAttribute($imei)
    {
        $this->attributes['imei'] = mb_strtoupper(trim($imei));
    }

    /**
     * Check if imei is in stock
     *
     * @return boolean
     */
    public function getInStockAttribute()
    {
        if (!is_null($this->deleted_at)) {
            return false;
        }

        $lastOrderProduct = $this->lastOrderProduct();

        if (!$lastOrderProduct) {
            return true;
        }

        if (in_array($lastOrderProduct->order->status, [2, 3])) {
            return false;
        }

        return true;
    }
}
