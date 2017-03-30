<?php namespace Core\Models\Stock;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;

/**
 * Removal model
 * @package Core\Models
 */
class Removal extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_removals';

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
     * Usuario
     * @return Usuario
     */
    public function user()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * RemovalProduct
     * @return RemovalProduct
     */
    public function removalProducts()
    {
        return $this->hasMany(RemovalProduct::class, 'stock_removal_id', 'id');
    }
}
