<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class DepotWithdrawProduct extends \Eloquent
{
    use RevisionableTrait;

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
        'stock_removal_id',
        'product_stock_id',
        'product_imei_id',
        'status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function withdraw()
    {
        return $this->belongsTo(DepotWithdraw::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productStock()
    {
        return $this->belongsTo(DepotProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class)->withTrashed();
    }
}
