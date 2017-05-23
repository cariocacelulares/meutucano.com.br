<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntryProduct extends \Eloquent
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
        'depot_entry_id',
        'product_sku',
        'depot_product_id',
        'quantity',
        'unitary_value',
        'total_value',
        'icms',
        'ipi',
        'pis',
        'cofins',
        'serials',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'unitary_value' => 'float',
        'taxed'         => 'boolean',
        'icms'          => 'float',
        'ipi'           => 'float',
        'pis'           => 'float',
        'cofins'        => 'float',
        'serials'       => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function depotEntry()
    {
        return $this->belongsTo(DepotEntry::class);
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
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entryProductSerials()
    {
        return $this->hasMany(DepotEntryProductSerial::class);
    }
}
