<?php namespace Core\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Illuminate\Database\Eloquent\Model;
use Core\Models\Produto\Linha\Atributo;
use Core\Events\ProductStockChange;

/**
 * Class Produto
 * @package Core\Models\Produto
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
        'sku',
        'marca_id',
        'linha_id',
        'titulo',
        'ncm',
        'ean',
        'referencia',
        'unidade',
        'estoque',
        'estado',
        'controle_serial',
        'ativo',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'ativo' => 'string',
        'estado' => 'string',
        'controle_serial' => 'boolean',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'estado_description'
    ];

    /**
     * @var array
     */
    /*protected $with = [
        'linha',
        'marca',
        'atributos',
    ];*/

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
            ->belongsToMany(Atributo::class, 'produto_atributo', 'produto_sku', 'atributo_id')
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
     * Retorna o estado de um produto legível
     *
     * @return string
     */
    protected function getEstadoDescriptionAttribute()
    {
        switch ($this->estado) {
            case '0':
                return 'Novo';
            case '1':
                return 'Seminovo';
            default:
                return 'Novo';
        }
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