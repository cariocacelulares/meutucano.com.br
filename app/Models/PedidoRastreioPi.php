<?php namespace App\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class PedidoRastreioPi
 * @package App\Models
 */
class PedidoRastreioPi extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

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
        'codigo_pi',
        'motivo_status',
        'status',
        'data_pagamento',
        'valor_pago',
        'acao',
        'protocolo',
        'pago_cliente',
        'observacoes'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
        'data_pagamento_readable',
        'created_at_readable',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'motivo_status' => 'string',
        'status'        => 'string',
        'acao'          => 'string',
        'pago_cliente'  => 'string',
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
     * Return description from status
     *
     * @return string
     */
    protected function getStatusDescriptionAttribute()
    {
        return ($this->motivo_status) ? \Config::get('tucano.status')[$this->motivo_status] : null;
    }


    /**
     * Return readable data de pagemento
     *
     * @return string
     */
    protected function getDataPagamentoReadableAttribute() {
        return ($this->data_pagamento) ? Carbon::createFromFormat('Y-m-d', $this->data_pagamento)->format('d/m/Y') : null;
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() {
        return ($this->created_at) ? Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y') : null;
    }
}
