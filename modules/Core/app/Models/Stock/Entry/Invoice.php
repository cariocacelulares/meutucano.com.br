<?php namespace Core\Models\Stock\Entry;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Stock\Entry;

/**
 * Invoice model
 * @package Core\Models\Stock\Entry
 */
class Invoice extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_entry_invoices';

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
        'emission',
    ];

    /**
     * Entry
     * @return Entry
     */
    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }
}
