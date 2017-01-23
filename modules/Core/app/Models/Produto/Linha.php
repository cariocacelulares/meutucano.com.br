<?php namespace Core\Models\Produto;

use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\Linha\Atributo;
use Core\Models\Produto;

/**
 * Class Linha
 * @package Core\Models\Produto
 */
class Linha extends \Eloquent
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
        'titulo',
        'ncm_padrao',
    ];

    /**
     * Atributos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function atributos()
    {
        return $this->hasMany(Atributo::class);
    }

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
