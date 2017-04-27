<?php namespace Core\Models;

use App\Models\User\User;
use Venturecraft\Revisionable\RevisionableTrait;

class DepotWithdraw extends Model
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
        'user_id',
        'is_continuous',
        'closed_at',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function removalProducts()
    {
        return $this->hasMany(DepotWithdrawProduct::class);
    }
}
