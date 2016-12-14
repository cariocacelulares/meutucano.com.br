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
        'valor',
        'quantidade',
        'imei',
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
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function produto()
    {
        return $this->hasOne(Produto::class, 'sku', 'produto_sku');
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