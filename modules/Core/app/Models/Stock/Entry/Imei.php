<?php namespace Core\Models\Stock\Entry;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\ProductImei;

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
        'product_imei_id',
    ];

    /**
     * Product
     * @return Product
     */
    public function entryProduct()
    {
        return $this->belongsTo(Product::class, 'stock_entry_product_id', 'id');
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
