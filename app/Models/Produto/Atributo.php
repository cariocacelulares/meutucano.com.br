<?php namespace App\Models\Produto;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Atributo
 * @package App\Models\Produto
 */
class Atributo extends \Eloquent
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
    public function produtos()
    {
        return $this
            ->belongsToMany(Produto::class, 'produto_atributo', 'atributo_id', 'produto_id')
            ->withPivot('opcao_id', 'valor');
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