<?php namespace Core\Models\Pedido;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\Nota\Devolucao;
use Core\Models\Pedido;

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
        'delete_note',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'numero',
        'serie',
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
}
