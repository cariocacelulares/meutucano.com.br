<?php namespace Modules\Core\Models\Produto;

use Venturecraft\Revisionable\RevisionableTrait;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Class ProdutoAtributoPivot
 * @package Modules\Core\Models\Produto
 */
class ProdutoAtributoPivot extends Pivot
{
    use RevisionableTrait;

    protected $table = 'produto_atributo';

    /**
     * @var array
     */
    protected $fillable = [
        'produto_sku',
        'atributo_id',
        'opcao_id',
        'valor',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'produto_sku' => 'string',
        'atributo_id' => 'string',
        'opcao_id' => 'string',
    ];

    /**
     * Atributo
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function atributo()
    {
        return $this->belongsTo(Atributo::class, 'atributo_id');
    }

    /**
     * Produto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_sku');
    }
}