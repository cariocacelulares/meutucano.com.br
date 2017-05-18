<?php namespace Core\Models;

use App\Models\User\User;
use App\Models\Traits\UploadableTrait;
use Core\Models\Traits\InvoiceableTrait;
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
     * @return array
     */
    protected $appends = [
        'print_url'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolutions()
    {
        return $this->hasMany(OrderInvoiceDevolution::class);
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

    /**
     * Return print URL for Model
     *
     * @return string
     */
    public function getPrintUrlAttribute()
    {
        return url("api/orders/invoices/{$this->id}/danfe?token=" . \JWTAuth::getToken());
    }
}
