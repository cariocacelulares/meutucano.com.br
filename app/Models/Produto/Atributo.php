<?php namespace App\Models\Produto;

use Venturecraft\Revisionable\RevisionableTrait;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Atributo
 * @package App\Models\Produto
 */
class Atributo extends Model
{
    use RevisionableTrait;

    protected $table = 'linha_atributos';

    /**
     * @var array
     */
    protected $fillable = [
        'titulo',
        'linha_id'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $with = [
        'opcoes'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'tipo'
    ];

    /**
     * Opções
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function opcoes()
    {
        return $this->hasMany(Opcao::class);
    }

    /**
     * Linha
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function linha()
    {
        return $this->belongsTo(Linha::class);
    }

    /**
     * Produtos
     * @return Object
     */
    /*public function produtos()
    {
        return $this
            ->belongsToMany(Produto::class, 'produto_atributo', 'atributo_id', 'produto_id')
            ->withPivot('opcao_id', 'valor');
    }*/
    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'produto_atributo', 'atributo_id', 'produto_id');
    }

    public function newPivot(Model $parent, array $attributes, $table, $exists)
    {
        if ($parent instanceof Produto) {
            return new ProdutoAtributoPivot($parent, $attributes, $table, $exists);
        }

        return parent::newPivot($parent, $attributes, $table, $exists);
    }

    /**
     * Tipo
     * @return String Se existem opcoes, definindo o tipo
     */
    public function getTipoAttribute()
    {
        return ($this->opcoes->isEmpty()) ? '0' : '1';
    }
}