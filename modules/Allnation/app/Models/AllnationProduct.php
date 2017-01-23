<?php namespace Allnation\Models;

use Core\Models\Produto;
use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class AllnationProduct
 * @package AllNation\Models\AllnationProduct
 */
class AllnationProduct extends Model
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
        'id',
        'produto_sku',
        'title',
        'category',
        'brand',
        'description',
        'ean',
        'ncm',
        'warranty',
        'weight',
        'cost',
        'image',
        'stock_from',
        'width',
        'height',
        'length',
        'origin'
    ];

    /**
     * Produto
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasOne
     */
    public function produto()
    {
        return $this->hasOne(Produto::class);
    }
}
