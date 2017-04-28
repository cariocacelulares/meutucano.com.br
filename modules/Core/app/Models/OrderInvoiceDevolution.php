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
        'user_id',
        'order_invoice_id',
        'key',
        'file',
        'type',
        'issued_at',
        'note'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'number',
        'serie',
        'type_readable',
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
    public function getTypeReadableAttribute()
    {
        return ($this->tipo == 1) ? 'Estorno' : 'Devolução';
    }

    /**
     * Return numero attribute
     *
     * @return string
     */
    public function getNumberAttribute()
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
