<?php namespace Core\Models;

use App\Models\User\User;
use Venturecraft\Revisionable\RevisionableTrait;

class OrderInvoiceDevolution extends \Eloquent
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
        'usuario_id',
        'nota_id',
        'chave',
        'arquivo',
        'tipo',
        'data',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'tipo_readable',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function invoice()
    {
        return $this->belongsTo(OrderInvoice::class);
    }

    /**
     * @return string
     */
    public function getTipoReadableAttribute()
    {
        return ($this->tipo == 1) ? 'Estorno' : 'Devolução';
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
