<?php namespace Core\Models;

class OrderTax extends \Eloquent
{
    /**
     * @var string
     */
    protected $primaryKey = 'order_id';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
