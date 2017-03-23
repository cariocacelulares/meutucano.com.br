<?php namespace Core\Models;

use Mercadolivre\Models\Ad;
use Core\Models\Produto\Linha;
use Core\Models\Produto\Marca;
use Core\Models\Produto\Image;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto\ProductStock;
use Core\Models\Stock\Entry\Product as EntryProduct;
use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Produto
 * @package Core\Models
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
        'valor',
        'estado',
        'warranty'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'estado' => 'string',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'estoque',
    ];

    /**
     * @var array
     */
    protected $with = [
        'linha',
        'marca',
    ];

    /**
     * ProductStock
     * @return ProductStock
     */
    public function productStocks()
    {
        return $this->hasMany(ProductStock::class, 'product_sku', 'sku');
    }

    /**
     * PedidoProduto
     * @return PedidoProduto
     */
    public function pedidoProdutos()
    {
        return $this->hasMany(PedidoProduto::class, 'produto_sku', 'sku');
    }

    /**
     * EntryProduct
     * @return EntryProduct
     */
    public function entryProducts()
    {
        return $this->hasMany(EntryProduct::class, 'product_sku', 'sku');
    }

    /**
     * Mercado Livre Ads
     * @return void
     */
    public function mercadolivreAds()
    {
        return $this->hasMany(Ad::class, 'product_sku', 'sku');
    }

    /**
     * Return the sum of included stocks
     * @return int
     */
    public function getStock()
    {
        $stock = $this->productStocks()
                ->join('stocks', 'stocks.slug', 'product_stocks.stock_slug')
                ->where('stocks.include', '=', true)
                ->sum('quantity');

        $reservados = $this->pedidoProdutos()
            ->join('pedidos', 'pedidos.id', 'pedido_produtos.pedido_id')
            ->whereIn('pedidos.status', [0, 1])
            ->count();

        return ($stock - $reservados);
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
     * Get product average cost
     *
     * @return float
     */
    public function getCost()
    {
        $qty = 0;
        $sum = 0;

        foreach ($this->entryProducts as $entryProduct) {
            if (!is_null($entryProduct->entry->confirmed_at)) {
                $qty += $entryProduct->quantity;
                $sum += ($entryProduct->unitary_value * $entryProduct->quantity);
            }
        }

        return ($sum / $qty);
    }
}
