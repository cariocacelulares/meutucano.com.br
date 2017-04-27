<?php namespace Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class ProductImei extends \Eloquent
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
        'product_stock_id',
        'imei',
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
        return $this->hasMany(RemovalProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function issue()
    {
        return $this->hasOne(ProductImeiIssue::class);
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
    public function entryImeis()
    {
        return $this->hasMany(Imei::class);
    }

    /**
     * @return OrderProduct
     */
    public function lastOrderProduct()
    {
        return $this->pedidoProdutos()->orderBy('created_at', 'desc')->first();
    }

    /**
     * Set the imei
     * @param string $imei upper and trim
     */
    public function setImeiAttribute($imei)
    {
        $this->attributes['imei'] = mb_strtoupper(trim($imei));
    }

    /**
     * Check if imei is in stock
     *
     * @return boolean
     */
    public function inStock()
    {
        if (!is_null($this->deleted_at)) {
            return false;
        }

        $lastOrderProduct = $this->lastOrderProduct();

        if (!$lastOrderProduct) {
            return true;
        }

        if (in_array($lastOrderProduct->pedido->status, [2, 3])) {
            return false;
        }

        return true;
    }
}
