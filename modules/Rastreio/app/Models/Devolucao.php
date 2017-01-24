<?php namespace Rastreio\Models;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Devolucao
 * @package Rastreio\Models
 */
class Devolucao extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var string
     */
    protected $table = 'pedido_rastreio_devolucoes';

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
        'motivo',
        'acao',
        'pago_cliente',
        'observacoes'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'motivo'       => 'string',
        'acao'         => 'string',
        'pago_cliente' => 'string',
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
