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
    public function lastOrderProduct()
    {
        if (!array_key_exists('orderProducts', $this->relations)) {
            $this->load('orderProducts');
        }

        return $this->getRelation('orderProducts')
            ->whereNull('returned_at')
            ->sortByDesc('created_at')
            ->first();
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
        if ($this->trashed()) return false;

        $lastOrderProduct = $this->lastOrderProduct();

        if (!$lastOrderProduct) {
            return true;
        } elseif ($lastOrderProduct->order->count_on_stock) {
            return false;
        }

        return true;
    }
}
