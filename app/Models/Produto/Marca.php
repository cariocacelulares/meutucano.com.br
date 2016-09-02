<?php namespace App\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Marca
 * @package App\Models\Produto
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
     * @var array
     */
    protected $appends = [
        'created_at_readable',
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
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}