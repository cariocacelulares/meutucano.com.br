<?php namespace App\Models;

/**
 * Class PedidoImposto
 * @package App\Models
 */
class PedidoImposto extends \Eloquent
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
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'icms',
        'pis',
        'cofins',
        'icms_destinatario',
        'icms_remetente',
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
}
