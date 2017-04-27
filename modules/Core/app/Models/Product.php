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
        'marca_id',
        'linha_id',
        'titulo',
        'ncm',
        'ean',
        'valor',
        'cost',
        'estado',
        'warranty'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'estado' => 'string',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'estoque',
    ];

    /**
     * @var array
     */
    protected $with = [
        'line',
        'brand',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depotProducts()
    {
        return $this->hasMany(DepotProduct::class);
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
    public function entryProducts()
    {
        return $this->hasMany(EntryProduct::class, 'product_sku', 'sku');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mercadolivreAds()
    {
        return $this->hasMany(Ad::class, 'product_sku', 'sku');
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
     * Return the sum of included stocks
     * @return int
     */
    public function getStock()
    {
        $stock = $this->productStocks()
                ->join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
                ->where('stocks.include', '=', true)
                ->sum('quantity');

        $reservados = $this->pedidoProdutos()
            ->join('pedidos', 'pedidos.id', 'pedido_produtos.pedido_id')
            ->whereIn('pedidos.status', [0, 1])
            ->count();

        return ($stock - $reservados);
    }

    /**
     * Return calculated estoque
     * @return int quantity in stock
     */
    public function getEstoqueAttribute()
    {
        return $this->getStock();
    }
}
