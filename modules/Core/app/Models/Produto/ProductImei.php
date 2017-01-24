<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class ProductImei
 * @package Core\Models\Pedido
 */
class ProductImei extends Model
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
        'product_stock_id',
        'imei',
    ];

    /**
     * ProductStock
     * @return ProductStock
     */
    public function productStock()
    {
        return $this->belongsTo(ProductStock::class);
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
     * Returns the last order product
     * @return PedidoProduto
     */
    public function lastOrderProduct()
    {
        return $this->pedidoProdutos->orderBy('created_at', 'desc')->first();
    }
}
