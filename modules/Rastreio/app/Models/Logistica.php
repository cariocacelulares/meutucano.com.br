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

    /**
     * Return protocolo from pedido
     *
     * @return string
     */
    public function getImagemCancelamentoAttribute()
    {
        if ((int)$this->acao === 1) {
            if ($rastreio = Rastreio::find($this->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    return ($pedido) ? $pedido->imagem_cancelamento : null;
                }
            }
        }

        return null;
    }
}
