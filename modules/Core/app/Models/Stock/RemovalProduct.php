<?php namespace Core\Models\Stock;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;

/**
 * RemovalProduct model
 * @package Core\Models
 */
class RemovalProduct extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_removal_products';

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'stock_removal_id',
        'product_stock_id',
        'product_imei_id',
        'quantity',
        'status',
    ];

    /**
     * Removal
     * @return Removal
     */
    public function removal()
    {
        return $this->belongsTo(Removal::class, 'stock_removal_id', 'id');
    }

    /**
     * ProductStock
     * @return ProductStock
     */
    public function productStock()
    {
        return $this->belongsTo(ProductStock::class);
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
