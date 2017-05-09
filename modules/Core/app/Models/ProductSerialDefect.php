<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class ProductSerialDefect extends \Eloquent
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
        'product_serial_id',
        'description',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productSerial()
    {
        return $this->belongsTo(ProductSerial::class)->withTrashed();
    }
}
