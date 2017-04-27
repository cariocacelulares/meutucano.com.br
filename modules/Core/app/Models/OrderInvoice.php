<?php namespace Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class OrderInvoice extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

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
        'devolution',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolution()
    {
        return $this->HasOne(OrderInvoiceDevolution::class);
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
