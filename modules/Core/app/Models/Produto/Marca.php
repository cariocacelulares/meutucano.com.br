<?php namespace Core\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto;

/**
 * Class Marca
 * @package Core\Models\Produto
 */
class Marca extends \Eloquent
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
        'titulo'
    ];

    /**
     * Produtos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at)
    {
        if (!$created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at)
    {
        if (!$updated_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}
