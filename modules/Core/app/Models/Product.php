<?php namespace Core\Models;

use Mercadolivre\Models\Ad;
use Venturecraft\Revisionable\RevisionableTrait;

class Product extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var string
     */
    protected $primaryKey = 'sku';

    /**
     * @var array
     */
    protected $fillable = [
        'sku',
        'brand_id',
        'line_id',
        'title',
        'ean',
        'ncm',
        'price',
        'cost',
        'condition',
        'warranty'
    ];

    /**
     * @var array
     */
    protected $hidden = [
        'reservedStockCount',
        'availableStockCount'
    ];

    /**
     * @return array
     */
    protected $appends = [
        'reserved_stock',
        'available_stock'
    ];

    protected $casts = [
      'price' => 'float',
      'cost'  => 'float'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depotProducts()
    {
        return $this->hasMany(DepotProduct::class, 'product_sku');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class, 'product_sku');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entryProducts()
    {
        return $this->hasMany(EntryProduct::class, 'product_sku');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mercadolivreAds()
    {
        return $this->hasMany(Ad::class, 'product_sku');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function line()
    {
        return $this->belongsTo(Line::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Return orders that are reserving the stock
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reservedStockCount()
    {
        return $this->hasMany(OrderProduct::class, 'product_sku')
            ->selectRaw('order_products.product_sku, count(*) as aggregate_reserved_stock')
            ->join('orders', 'orders.id', 'order_products.order_id')
            ->whereIn('orders.status', [Order::STATUS_PENDING, Order::STATUS_PAID]);
    }

    /**
     * Return depot products that are included to the stock
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function availableStockCount()
    {
        return $this->hasMany(DepotProduct::class, 'product_sku')
            ->selectRaw('depot_products.product_sku, quantity')
            ->join('depots', 'depots.slug', 'depot_products.depot_slug')
            ->where('depots.include', '=', true);
    }

    /**
     * Return count of reserved stock from product
     *
     * @return int
     */
    public function getReservedStockAttribute()
    {
        if (!array_key_exists('reservedStockCount', $this->relations)) {
            return;
        }

        $related = $this->getRelation('reservedStockCount')->first();
        return $related ? (int) $related->aggregate_reserved_stock : 0;
    }


    /**
     * Return count of available stock from product
     *
     * @return int
     */
    public function getAvailableStockAttribute()
    {
        if (!array_key_exists('availableStockCount', $this->relations)) {
          return;
        }

        if (!array_key_exists('reservedStockCount', $this->relations)) {
            $this->load('reservedStockCount');
        }

        $stock    = $this->availableStockCount->sum('quantity');
        $reserved = $this->reserved_stock;

        return ($stock - $reserved);
    }
}
