<?php namespace App\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class PedidoRastreioLogistica
 * @package App\Models
 */
class PedidoRastreioLogistica extends \Eloquent
{
    use RevisionableTrait;

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
        'protocolo',
        'data_postagem',
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
     * @return string
     */
    public function getDataPostagemAttribute($data_postagem) {
        return ($data_postagem) ? Carbon::createFromFormat('Y-m-d', $data_postagem)->format('d/m/Y') : null;
    }

    /**
     * @return string
     */
    public function setDataPostagemAttribute($data_postagem) {
        $this->attributes['data_postagem'] = Carbon::createFromFormat('d/m/Y', $data_postagem)->format('Y-m-d');
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at) {
        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}