<?php namespace Core\Models\Produto;

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
}
