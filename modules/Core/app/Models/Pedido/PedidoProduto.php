<?php namespace Core\Models\Pedido;

use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto;
use Core\Models\Produto\ProductImei;
use Core\Models\Pedido;

/**
 * Class PedidoProduto
 * @package Core\Models\Pedido
 */
class PedidoProduto extends \Eloquent
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
        'pedido_id',
        'produto_sku',
        'product_imei_id',
        'product_stock_id',
        'valor',
    ];

    /**
     * Produto
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_sku', 'sku');
    }

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * ProductImei
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class);
    }

    /**
     * ProductStock
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productStock()
    {
        return $this->belongsTo(ProductStock::class);
    }
}
