<?php namespace App\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Illuminate\Database\Eloquent\Model;
use App\Models\Produto\Linha\Atributo;

/**
 * Class Produto
 * @package App\Models\Produto
 */
class Produto extends Model
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var string
     */
    protected $primaryKey = 'sku';

    /**
     * @var array
     */
    protected $fillable = [
        'marca_id',
        'linha_id',
        'titulo',
        'ncm',
        'ean',
        'referencia',
        'unidade',
        'estoque',
        'controle_serial',
        'ativo',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'ativo' => 'string',
        'controle_serial' => 'boolean',
    ];

    /**
     * @var array
     */
    protected $with = [
        'linha',
        'marca',
        'atributos',
    ];

    /**
     * Linha
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function linha()
    {
        return $this->belongsTo(Linha::class);
    }

    /**
     * Marca
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function marca()
    {
        return $this->belongsTo(Marca::class);
    }

    /**
     * Atributos
     * @return Object
     */
    public function atributos()
    {
        return $this
            ->belongsToMany(Atributo::class, 'produto_atributo', 'produto_id', 'atributo_id')
            ->withPivot('opcao_id', 'valor');
    }

    public function newPivot(Model $parent, array $attributes, $table, $exists)
    {
        if ($parent instanceof Atributo) {
            return new ProdutoAtributoPivot($parent, $attributes, $table, $exists);
        }

        return parent::newPivot($parent, $attributes, $table, $exists);
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at) {
        if (!$created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        if (!$updated_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}