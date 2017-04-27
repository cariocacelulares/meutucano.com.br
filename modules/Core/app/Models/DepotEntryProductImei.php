<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntryProductImei extends \Eloquent
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
        'stock_entry_product_id',
        'product_imei_id',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function entryProduct()
    {
        return $this->belongsTo(DepotEntryProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class);
    }
}
