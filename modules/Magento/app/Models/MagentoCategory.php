<?php namespace Magento\Models;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class MagentoCategory
 * @package Magento\Models
 */
class MagentoCategory extends Model
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
        'weigth',
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