<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class PedidoRastreioDevolucao
 * @package App\Models
 */
class PedidoRastreioDevolucao extends \Eloquent
{
    /**
     * @var string
     */
    protected $table = 'pedido_rastreio_devolucoes';

    /**
     * @var string
     */
    protected $primaryKey = 'rastreio_id';

    /**
     * @var array
     */
    protected $fillable = [
        'rastreio_id',
        'motivo',
        'acao',
        'protocolo',
        'pago_cliente',
        'observacoes'
    ];

    /**
     * Rastreio
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rastreio()
    {
        return $this->belongsTo(PedidoRastreio::class);
    }


    /**
     * Rastreio Ref
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function rastreioRef()
    {
        return $this->hasOne(PedidoRastreio::class, 'rastreio_ref_id');
    }
}