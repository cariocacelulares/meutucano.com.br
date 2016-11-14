<?php namespace App\Models\Pedido;

use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Produto\Produto;
use App\Events\OrderSeminovo;
use App\Events\ProductDispach;
use App\Models\Inspecao\InspecaoTecnica;

/**
 * Class PedidoProduto
 * @package App\Models\Pedido
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
        'imei'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    // protected $with = ['produto'];

    /**
     * @var array
     */
    protected $appends = ['total'];

    /**
     * Actions
     */
    protected static function boot() {
        parent::boot();

        // Quando um novo pedido produto for criado
        static::saved(function($pedidoProduto) {
            $pedido = $pedidoProduto->pedido;
            $produto = $pedidoProduto->produto;

            if ($pedidoProduto->wasRecentlyCreated) {

                if ((int)$pedido->status !== 5) {
                    \Event::fire(new ProductDispach($pedidoProduto->produto, $pedidoProduto->quantidade));
                }

                // Se o status do pedido for pago, o pedido produto nao tiver inspecao nem imei e o produto for seminovo
                if ($pedido->status == 1 && !$pedidoProduto->inspecao_tecnica && !$pedidoProduto->imei && $produto->estado == 1) {
                    \Event::fire(new OrderSeminovo($pedidoProduto));
                }
            }
        });
    }

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