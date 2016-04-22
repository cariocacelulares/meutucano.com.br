<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class PedidoRastreio
 * @package App\Models
 */
class PedidoRastreio extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'rastreio_ref_id',
        'data_envio',
        'rastreio',
        'servico',
        'valor',
        'prazo',
        'observacao',
        'status',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
        'tipo_description',
        'data_envio_readable'
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Pedido de informação
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pi()
    {
        return $this->hasOne(PedidoRastreioPi::class, 'rastreio_id');
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolucao()
    {
        return $this->hasOne(PedidoRastreioDevolucao::class, 'rastreio_id');
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function logistica()
    {
        return $this->hasOne(PedidoRastreioLogistica::class, 'rastreio_id');
    }

    /**
     * Rastreio de referência do pedido de informação
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rastreioRef()
    {
        return $this->belongsTo(PedidoRastreio::class);
    }

    /**
     * Return description from status
     *
     * @return string
     */
    protected function getStatusDescriptionAttribute()
    {
        return \Config::get('tucano.status')[$this->status];
    }

    /**
     * Return description from tipo
     *
     * @return string
     */
    protected function getTipoDescriptionAttribute()
    {
        switch ($this->tipo) {
            case 1:
                return 'Devolução';
            case 2:
                return 'Reenvio por extravio';
            case 3:
                return 'Logística reversa';
            default:
                return 'Padrão';
        }
    }

    /**
     * Return readable CEP
     *
     * @return string
     */
    protected function getDataEnvioReadableAttribute() {
        return Carbon::createFromFormat('Y-m-d', $this->data_envio)->format('d/m/Y');
    }
}