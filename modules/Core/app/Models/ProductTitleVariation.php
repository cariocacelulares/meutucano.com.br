<?php namespace Core\Models;

class ProductTitleVariation extends \Eloquent
{
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'title',
        'product_sku',
        'ean',
        'ncm',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
