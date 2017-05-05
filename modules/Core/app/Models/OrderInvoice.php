<?php namespace Core\Models;

use Core\Models\Traits\InvoiceableTrait;
use App\Models\Traits\UploadableTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class OrderInvoice extends \Eloquent
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
        'order_id',
        'user_id',
        'file',
        'note',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolution()
    {
        return $this->hasOne(OrderInvoiceDevolution::class);
    }

    /**
     * Return file full url
     *
     * @param  string $file
     * @return string
     */
    public function getFileAttribute($file)
    {
        return fileUrl(self::UPLOAD_PATH . '/' . $file);
    }
}
