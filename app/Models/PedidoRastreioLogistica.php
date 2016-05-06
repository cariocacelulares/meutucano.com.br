<?php namespace App\Models;
use Carbon\Carbon;

/**
 * Class PedidoRastreioLogistica
 * @package App\Models
 */
class PedidoRastreioLogistica extends \Eloquent
{
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
    protected $fillable = [
        'rastreio_id',
        'usuario_id',
        'autorizacao',
        'motivo',
        'acao',
        'protocolo',
        'data_postagem',
        'observacoes'
    ];

    protected $appends = [
        'data_postagem_readable'
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
     * Return readable Data Postagem
     *
     * @return string
     */
    protected function getDataPostagemReadableAttribute() {
        return ($this->data_postagem) ? Carbon::createFromFormat('Y-m-d', $this->data_postagem)->format('d/m/Y') : null;
    }
}