<?php namespace Rastreio\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\Pedido;

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
     * @var array
     */
    protected $appends = [
        'protocolo',
        'imagem_cancelamento',
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
     * Rastreio Ref
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function rastreioRef()
    {
        return $this->hasOne(PedidoRastreio::class, 'rastreio_ref_id');
    }
}
