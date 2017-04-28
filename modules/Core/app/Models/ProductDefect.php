<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class ProductDefect extends \Eloquent
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
        'product_sku',
        'product_serial_id',
        'description',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function serial()
    {
        return $this->belongsTo(ProductSerial::class)->withTrashed();
    }
}
