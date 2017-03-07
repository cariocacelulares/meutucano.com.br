<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Stock\RemovalProduct;
use Core\Models\Stock\Issue;
use Core\Models\Produto\Defect;

/**
 * Class ProductImei
 * @package Core\Models\Pedido
 */
class ProductImei extends Model
{
    use SoftDeletes,
        RevisionableTrait;

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
        return $this->pedidoProdutos()->orderBy('created_at', 'desc')->first();
    }

    /**
     * RemovalProduct
     * @return RemovalProduct
     */
    public function removalProducts()
    {
        return $this->hasMany(RemovalProduct::class);
    }

    /**
     * Issue
     * @return Issue
     */
    public function issue()
    {
        return $this->hasOne(Issue::class);
    }

    /**
     * Defect
     * @return Defect
     */
    public function defect()
    {
        return $this->hasOne(Defect::class);
    }
}
