<?php namespace Rastreio\Models\Rastreio;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido;

/**
 * Class Rastreio
 * @package Rastreio\Models
 */
class Rastreio extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    protected $table = 'pedido_rastreios';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'data_envio',
        'rastreio',
        'servico',
        'valor',
        'prazo',
        'status',
        'imagem_historico',
        'delete_note',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'status' => 'string'
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
        return $this->hasOne(Pi::class);
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolucao()
    {
        return $this->hasOne(Devolucao::class);
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function logistica()
    {
        return $this->hasOne(Logistica::class);
    }

    /**
     * Monitorado
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function monitoramentos()
    {
        return $this->hasMany(Monitorado::class);
    }

    /**
     * Rastreio de referência do pedido de informação
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rastreioRef()
    {
        return $this->belongsTo(Rastreio::class);
    }

    /**
     * Retorna o cep do endereço do pedido
     *
     * @return int|string
     */
    public function getCep()
    {
        return $this->pedido->endereco->cep;
    }
}
