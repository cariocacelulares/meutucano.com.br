<?php namespace Core\Models;

use App\Models\User\User;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntry extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'supplier_id',
        'description',
        'confirmed_at',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'confirmed'
    ];

    /**
     * Return if entry was confirmed
     *
     * @return void
     */
    public function getConfirmedAttribute()
    {
        return ($this->confirmed_at) true : false;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function invoice()
    {
        return $this->hasOne(DepotEntryInvoice::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(DepotEntryProduct::class);
    }
}
