<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class PedidoRastreioPi
 * @package App\Models
 */
class PedidoRastreioPi extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'rastreio_id';

    /**
     * @var array
     */
    protected $fillable = [
        'rastreio_id',
        'codigo_pi',
        'motivo_status',
        'status',
        'data_pagamento',
        'valor_pago',
        'protocolo',
        'acao',
        'observacoes'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
        'data_pagamento_readable',
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
}