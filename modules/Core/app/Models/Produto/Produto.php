<?php namespace Core\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Illuminate\Database\Eloquent\Model;
use Core\Models\Produto\Linha\Atributo;
use Core\Events\ProductStockUpdated;
use Sofa\Eloquence\Eloquence;
use Core\Models\Produto\ProductStock;

/**
 * Class Produto
 * @package Core\Models\Produto
 */
class Produto extends Model
{
    use RevisionableTrait, Eloquence;

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
        'estado',
        'controle_serial',
        'ativo',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'ativo'           => 'string',
        'estado'          => 'string',
        'controle_serial' => 'boolean',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'estoque',
    ];

    /**
     * ProductStock
     * @return ProductStock
     */
    public function product_stocks()
    {
        return $this->hasMany(ProductStock::class, 'product_sku', 'sku');
    }

    /**
     * Return the sum of included stocks
     * @return int
     */
    public function getStock()
    {
        $stock = 0;

        $product_stocks = $this->product_stocks()
                ->join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
                ->where('stocks.include', '=', true)
                ->get();

        foreach ($product_stocks as $product_stock) {
            $stock += $product_stock->quantity;
        }

        return $stock;
    }

    /**
     * Return calculated estoque
     * @return int quantity in stock
     */
    public function getEstoqueAttribute()
    {
        return $this->getStock();
    }

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
    /*public function linha()
    {
        return $this->belongsTo(Linha::class);
    }*/

    /**
     * Marca
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    /*public function marca()
    {
        return $this->belongsTo(Marca::class);
    }*/

    /**
     * Atributos
     * @return Object
     */
    /*public function atributos()
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
    }*/
}
