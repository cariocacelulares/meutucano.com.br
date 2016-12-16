<?php namespace Rastreio\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\Pedido;

/**
 * Class Pi
 * @package Rastreio\Models
 */
class Pi extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_rastreio_pis';

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
        'pago_cliente',
        'observacoes'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
        'protocolo',
        'motivo_description',
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
        return $this->belongsTo(Rastreio::class);
    }

    /**
     * Return description from motivo
     *
     * @return string
     */
    public function getMotivoDescriptionAttribute()
    {
        switch ($this->motivo_status) {
            case '0': return 'Outro';
            case '2': return 'Atraso';
            case '3': return 'Extravio';
            default: return 'Outro';
        }
    }

    /**
     * Return description from status
     *
     * @return string
     */
    public function getStatusDescriptionAttribute()
    {
        return ($this->motivo_status) ? \Config::get('rastreio.status')[$this->motivo_status] : null;
    }

    /**
     * @return string
     */
    public function getDataPagamentoAttribute($data_pagamento)
    {
        return ($data_pagamento) ? Carbon::createFromFormat('Y-m-d', $data_pagamento)->format('d/m/Y') : null;
    }

    /**
     * @return string
     */
    public function setDataPagamentoAttribute($data_pagamento)
    {
        $this->attributes['data_pagamento'] = ($data_pagamento) ? Carbon::createFromFormat('d/m/Y', $data_pagamento)->format('Y-m-d') : null;
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at)
    {
        if (!$created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at)
    {
        if (!$updated_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }

    /**
     * Return protocolo from pedido
     *
     * @return string
     */
    public function getProtocoloAttribute()
    {
        if ((int)$this->acao === 1) {
            if ($rastreio = Rastreio::find($this->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    return ($pedido) ? $pedido->protocolo : null;
                }
            }
        }

        return null;
    }
}
