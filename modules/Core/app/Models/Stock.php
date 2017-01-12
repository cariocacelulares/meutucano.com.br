<?php namespace Core\Models;

use Core\Models\Produto\ProductStock;

/**
 * Stock model
 * @package Core\Models;
 */
class Stock extends \Eloquent
{
    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'title',
        'include',
        'priority',
    ];

    /**
     * ProductStock
     * @return ProductStock
     */
    public function product_stoks()
    {
        return $this->hasMany(ProductStock::class);
    }
}
