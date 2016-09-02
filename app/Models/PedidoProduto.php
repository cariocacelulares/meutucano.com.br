<?php namespace App\Models;

use App\Models\Produto\Produto;

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
     * @var array
     */
    protected $with = ['produto'];

    /**
     * @var array
     */
    protected $appends = ['total'];

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
