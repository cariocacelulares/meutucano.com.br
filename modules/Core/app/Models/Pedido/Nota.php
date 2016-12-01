<?php namespace Core\Models\Pedido;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\Nota\Devolucao;

/**
 * Class Nota
 * @package Core\Models\Pedido
 */
class Nota extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    protected $table = 'pedido_notas';

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'usuario_id',
        'chave',
        'arquivo',
        'data',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'numero',
        'serie'
    ];

    /**
     * @var array
     */
    protected $with = [
        'devolucao',
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolucao()
    {
        return $this->HasOne(Devolucao::class);
    }

    /**
     * Return numero attribute
     *
     * @return string
     */
    public function getNumeroAttribute()
    {
        return (int) (substr($this->chave, 25, 9)) ?: $this->pedido_id;
    }

    /**
     * Return serie attribute
     *
     * @return string
     */
    public function getSerieAttribute()
    {
        return (substr($this->chave, 34, 1)) ?: 1;
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getDataAttribute($data)
    {
        return Carbon::createFromFormat('Y-m-d', $data)->format('d/m/Y');
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
}