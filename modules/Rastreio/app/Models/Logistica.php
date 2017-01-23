<?php namespace Rastreio\Models\Rastreio;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Logistica
 * @package Rastreio\Models
 */
class Logistica extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_rastreio_logisticas';

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
        'autorizacao',
        'motivo',
        'acao',
        'observacoes',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'motivo' => 'string',
        'acao'   => 'string',
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
