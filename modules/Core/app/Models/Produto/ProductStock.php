<?php namespace Core\Models\Produto;

use Carbon\Carbon;
use Core\Models\Stock;
use Core\Models\Produto\Produto;
use Core\Events\ProductStockChange;
use Illuminate\Database\Eloquent\Model;
use Core\Models\Produto\Linha\Atributo;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class ProductStock
 * @package Core\Models
 */
class ProductStock extends Model
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'stock_id',
        'produto_sku',
        'quantity',
    ];

    /**
     * Product
     * @return Product
     */
    public function product()
    {
        return $this->belongsTo(Produto::class, 'produto_sku', 'sku');
    }

    /**
     * Stock
     * @return Stock
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
