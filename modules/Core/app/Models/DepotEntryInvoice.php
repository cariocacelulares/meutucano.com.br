<?php namespace Core\Models;

use App\Models\Traits\UploadableTrait;
use Core\Models\Traits\InvoiceableTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntryInvoice extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait,
        UploadableTrait,
        InvoiceableTrait;

    const UPLOAD_PATH = 'nota';
    const UPLOAD_ATTR = ['file'];

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'depot_entry_id',
        'user_id',
        'file',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function entry()
    {
        return $this->belongsTo(DepotEntry::class);
    }
}
