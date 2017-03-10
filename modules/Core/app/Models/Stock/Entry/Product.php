<?php namespace Core\Models\Stock\Entry;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Stock;
use Core\Models\Stock\Entry;
use Core\Models\Produto;
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
     * Stock
     * @return Stock
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    /**
     * Produto
     * @return Produto
     */
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

    /**
     * TitleVariation
     * @return TitleVariation
     */
    public function titleVariation()
    {
        return $this->belongsTo(TitleVariation::class);
    }
}
