<?php namespace App\Models;

/**
 * Class PedidoProduto
 * @package App\Models
 */
class PedidoProduto extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = ['*'];

    /**
     * @var bool
     */
    public $timestamps = false;

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
}
