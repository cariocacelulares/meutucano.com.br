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
        'stock_entry_id',
        'product_sku',
        'depot_product_id',
        'quantity',
        'unitary_value',
        'total_value',
        'icms',
        'ipi',
        'pis',
        'cofins',
        'imeis',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'ean',
        'ncm',
        'title',
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
    public function entryImeis()
    {
        return $this->hasMany(EntryImei::class);
    }

    /**
     * Decode imeis from json
     *
     * @param  string  $imeis imeis json encoded
     * @return array|null
     */
    public function getImeisAttribute($imeis)
    {
        if (!$imeis) return null;

        return implode(PHP_EOL, json_decode($imeis));
    }

    /**
     * Get product title
     * @return string
     */
    public function getTitleAttribute()
    {
        return $this->product->titulo;
    }

    /**
     * Get product ncm
     * @return string
     */
    public function getNcmAttribute()
    {
        return $this->product->ncm;
    }

    /**
     * Get product ean
     * @return string
     */
    public function getEanAttribute()
    {
        return $this->product->ean;
    }
}
