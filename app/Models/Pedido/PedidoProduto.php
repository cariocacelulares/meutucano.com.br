<?php namespace App\Models\Pedido;

use App\Models\Produto\Produto;
use App\Events\ProductDispach;

/**
 * Class PedidoProduto
 * @package App\Models\Pedido
 */
class PedidoProduto extends \Eloquent
{
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
    protected $with = ['produto'];

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
        static::created(function($pedidoProduto) {
            $pedido = $pedidoProduto->pedido;

            if ((int)$pedido->status !== 5) {
                \Event::fire(new ProductDispach($pedidoProduto->produto, $pedidoProduto->quantidade));
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
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
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