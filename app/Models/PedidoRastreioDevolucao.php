<?php namespace App\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class PedidoRastreioDevolucao
 * @package App\Models
 */
class PedidoRastreioDevolucao extends \Eloquent
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
     * @var string
     */
    protected $primaryKey = 'rastreio_id';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    protected $fillable = ['*'];

    /**
     * @var array
     */
    protected $appends = [
        'motivo_description',
        'created_at_readable'
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
     * Descrição do motivo
     * 
     * @return string
     */
    protected function getMotivoDescriptionAttribute() {
        return ($this->motivo >= 0) ? \Config::get('tucano.devolucao_status')[$this->motivo] : null;
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y');
    }
}
