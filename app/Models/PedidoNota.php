<?php namespace App\Models;

/**
 * Class PedidoNota
 * @package App\Models
 */
class PedidoNota extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'pedido_id';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'data',
        'chave',
        'arquivo'
    ];

    protected $appends = [
        'numero',
        'serie'
    ];

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
     * Return numero attribute
     *
     * @return string
     */
    public function getNumeroAttribute()
    {
        return (substr($this->pedido_id, 0, -1)) ?: $this->pedido_id;
    }

    /**
     * Return serie attribute
     *
     * @return string
     */
    public function getSerieAttribute()
    {
        return (substr($this->pedido_id, -1)) ?: 1;
    }
}

