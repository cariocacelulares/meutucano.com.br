<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntryInvoice extends \Eloquent
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
        'key',
        'series',
        'number',
        'model',
        'cfop',
        'total',
        'file',
        'emission',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function entry()
    {
        return $this->belongsTo(DepotEntry::class);
    }
}
