<?php namespace App\Models;
use Carbon\Carbon;

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
        'usuario_id',
        'data',
        'chave',
        'arquivo'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
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

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}

