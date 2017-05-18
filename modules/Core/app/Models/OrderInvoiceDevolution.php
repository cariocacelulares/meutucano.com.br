<?php namespace Core\Models;

use App\Models\Traits\UploadableTrait;
use Core\Models\Traits\InvoiceableTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class OrderInvoiceDevolution extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait,
        InvoiceableTrait,
        UploadableTrait;

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
        'order_invoice_id',
        'user_id',
        'file',
        'type',
        'note',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'print_url',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function orderInvoice()
    {
        return $this->belongsTo(OrderInvoice::class);
    }

    /**
     * Return print URL for Model
     *
     * @return string
     */
    public function getPrintUrlAttribute()
    {
        return url("api/orders/invoices/devolutions/{$this->id}/danfe?token=" . \JWTAuth::getToken());
    }
}
