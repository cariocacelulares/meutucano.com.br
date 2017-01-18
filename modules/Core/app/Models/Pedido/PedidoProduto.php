<?php namespace Core\Models\Pedido;

use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\Produto;
use InspecaoTecnica\Models\InspecaoTecnica;

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
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $appends = [
        'total',
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

    /**
     * InspecaoTecnica
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     */
    public function inspecoes()
    {
        return $this->hasMany(InspecaoTecnica::class, 'pedido_produtos_id', 'id');
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getTotalAttribute()
    {
        return $this->valor * $this->quantidade;
    }
}
