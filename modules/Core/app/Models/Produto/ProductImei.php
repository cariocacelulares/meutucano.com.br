<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto;

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
     * @var array
     */
    protected $appends = [
        'pedidoProduto'
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
     * Returns the last order productStock
     * @return PedidoProduto
     */
    public function getPedidoProdutoAttribute()
    {
        return $this->pedidoProdutos->orderBy('created_at', 'desc')->first();
    }
}
