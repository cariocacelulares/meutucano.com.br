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
    public function getStatusDescriptionAttribute()
    {
        return ($this->motivo_status) ? \Config::get('tucano.status')[$this->motivo_status] : null;
    }

    /**
     * @return string
     */
    public function getDataPagamentoAttribute($data_pagamento) {
        return ($data_pagamento) ? Carbon::createFromFormat('Y-m-d', $data_pagamento)->format('d/m/Y') : null;
    }

    /**
     * @return string
     */
    public function setDataPagamentoAttribute($data_pagamento) {
        $this->attributes['data_pagamento'] = Carbon::createFromFormat('d/m/Y', $data_pagamento)->format('Y-m-d');
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at) {
        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}
