<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class DepotWithdrawProduct extends \Eloquent
{
    use RevisionableTrait;

    const STATUS_WITHDRAWN = 0;
    const STATUS_CONFIRMED = 1;
    const STATUS_INVOICED  = 2;
    const STATUS_RETURNED  = 3;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'depot_withdraw_id',
        'depot_product_id',
        'product_serial_id',
        'status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function depotWithdraw()
    {
        return $this->belongsTo(DepotWithdraw::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function depotProduct()
    {
        return $this->belongsTo(DepotProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productSerial()
    {
        return $this->belongsTo(ProductSerial::class)->withTrashed();
    }
}
