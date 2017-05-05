<?php namespace Core\Models;

use App\Models\User\User;
use App\Models\Traits\UploadableTrait;
use Venturecraft\Revisionable\RevisionableTrait;

class OrderCall extends \Eloquent
{
    use RevisionableTrait,
        UploadableTrait;

    const UPLOAD_PATH = 'ligacoes';
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
