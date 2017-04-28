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
        'order_id',
        'user_id',
        'key',
        'file',
        'issued_at',
        'note',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'number',
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
        return $this->hasOne(OrderInvoiceDevolution::class);
    }

    /**
     * Return number attribute
     *
     * @return string
     */
    public function getNumberAttribute()
    {
        return (int) (substr($this->chave, 25, 9)) ?: null;
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
