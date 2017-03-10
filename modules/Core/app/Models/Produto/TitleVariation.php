<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\Model;
use Core\Models\Produto;

/**
 * Class TitleVariation
 * @package Core\Models\Produto
 */
class TitleVariation extends Model
{
    protected $table = 'product_title_variations';

    /**
     * @var array
     */
    protected $fillable = [
        'title',
        'product_sku',
        'ean',
        'ncm',
    ];

    /**
     * Produto
     * @return Produto
     */
    public function product()
    {
        return $this->belongsTo(Produto::class, 'product_sku', 'sku');
    }
}
