<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto;

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
     * @var array
     */
    protected $fillable = [
        'stock_slug',
        'product_sku',
        'quantity',
    ];

    /**
     * Product
     * @return Product
     */
    public function product()
    {
        return $this->belongsTo(Produto::class, 'product_sku', 'sku');
    }

    /**
     * Stock
     * @return Stock
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_slug', 'slug');
    }

    /**
     * PedidoProduto
     * @return PedidoProduto
     */
    public function pedidoProdutos()
    {
        return $this->hasMany(PedidoProduto::class);
    }

    /**
     * ProductImei
     * @return ProductImei
     */
    public function productImeis()
    {
        return $this->hasMany(ProductImei::class);
    }
}
