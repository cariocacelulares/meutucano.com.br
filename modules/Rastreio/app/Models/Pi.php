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
}
