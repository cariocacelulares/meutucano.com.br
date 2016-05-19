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
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    protected $fillable = [
        'rastreio_id',
        'usuario_id',
        'motivo',
        'acao',
        'protocolo',
        'pago_cliente',
        'observacoes'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable'
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

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y');
    }
}