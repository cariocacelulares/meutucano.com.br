<?php namespace Core\Models\Stock\Entry;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\ProductIei;

/**
 * Imei model
 * @package Core\Models\Stock\Entry
 */
class Imei extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_entry_product_imeis';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'stock_entry_product_id',
        'product_imei',
    ];

    /**
     * Product
     * @return Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * ProductImei
     * @return ProductImei
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class);
    }
}
