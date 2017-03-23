<?php namespace Core\Models\Stock\Entry;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Stock\Entry;
use Core\Models\Produto;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\TitleVariation;

/**
 * Product model
 * @package Core\Models\Stock\Entry
 */
class Product extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_entry_products';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'stock_entry_id',
        'product_sku',
        'product_stock_id',
        'product_title_variation_id',
        'quantity',
        'unitary_value',
        'total_value',
        'icms',
        'ipi',
        'pis',
        'cofins',
        'imeis',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'ean',
        'ncm',
        'title',
    ];

    /**
     * Entry
     * @return Entry
     */
    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }

    /**
     * ProductStock
     * @return ProductStock
     */
    public function productStock()
    {
        return $this->belongsTo(ProductStock::class, 'product_stock_id', 'id');
    }

    /**
     * Produto
     * @return Produto
     */
    public function product()
    {
        return $this->belongsTo(Produto::class, 'product_sku', 'sku');
    }

    /**
     * TitleVariation
     * @return TitleVariation
     */
    public function titleVariation()
    {
        return $this->belongsTo(TitleVariation::class);
    }

    /**
     * Decode imeis from json
     *
     * @param  string  $imeis imeis json encoded
     * @return array|null
     */
    public function getImeisAttribute($imeis)
    {
        return json_decode($imeis);
    }

    /**
     * Get product title
     * @return string
     */
    public function getTitleAttribute()
    {
        return $this->product->titulo;
    }

    /**
     * Get product ncm
     * @return string
     */
    public function getNcmAttribute()
    {
        return $this->product->ncm;
    }

    /**
     * Get product ean
     * @return string
     */
    public function getEanAttribute()
    {
        return $this->product->ean;
    }
}
