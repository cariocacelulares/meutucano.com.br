<?php namespace Core\Models;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\ProductStock;

/**
 * Stock model
 * @package Core\Models
 */
class Stock extends Model
{
    use RevisionableTrait;

    /**
     * @var string
     */
    public $primaryKey = 'slug';

    /**
     * @var boolean
     */
    public $incrementing = false;

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
     * @var array
     */
    protected $casts = [
        'include' => 'boolean',
    ];

    /**
     * ProductStock
     * @return ProductStock
     */
    public function productStocks()
    {
        return $this->hasMany(ProductStock::class, 'stock_slug', 'slug');
    }
}
