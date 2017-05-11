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
        'icms'   => 'float',
        'ipi'    => 'float',
        'pis'    => 'float',
        'cofins' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function entry()
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
    public function serials()
    {
        return $this->hasMany(DepotEntryProductSerial::class);
    }

    /**
     * Decode serials from json
     *
     * @param  string  $serials
     * @return array|null
     */
    public function getSerialsAttribute($serials)
    {
        if (!$serials) return null;

        return json_decode($serials);
    }

    /**
     * Encode serials to json
     *
     * @param  array  $serials
     * @return string|null
     */
    public function setSerialsAttribute($serials)
    {
        $this->attributes['serials'] = json_encode($serials);
    }
}
