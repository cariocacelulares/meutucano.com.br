<?php namespace Modules\Core\Models\Pedido\Rastreio;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Modules\Core\Models\Pedido\Rastreio;
use Modules\Core\Models\Pedido\Pedido;

/**
 * Class Devolucao
 * @package Modules\Core\Models\Pedido\Rastreio
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
    protected $appends = [
        'motivo_description',
        'protocolo',
        'imagem_cancelamento',
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
     * Descrição do motivo
     *
     * @return string
     */
    protected function getMotivoDescriptionAttribute() {
        return ($this->motivo >= 0) ? \Config::get('tucano.notas.devolucao_status')[$this->motivo] : null;
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