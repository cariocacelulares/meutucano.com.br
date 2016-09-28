<?php namespace App\Models\Pedido\Rastreio;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Pedido;

/**
 * Class Pi
 * @package App\Models\Pedido\Rastreio
 */
class Pi extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_rastreio_pis';
    protected $primaryKey = 'rastreio_id';

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
        'protocolo'
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
        if (!$created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        if (!$updated_at)
            return null;

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
            $pedido = Pedido::find($this->pedido_id);
            return ($pedido) ? $pedido->protocolo : null;
        } else {
            return null;
        }
    }
}