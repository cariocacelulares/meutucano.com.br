<?php namespace Mercadolivre\Models;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto;

/**
 * Class Ad
 * @package Mercadolivre\Models
 */
class Ad extends Model
{
    use RevisionableTrait;

    /**
     * @var string
     */
    protected $table = 'mercadolivre_ads';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'product_sku',
        'template_id',
        'code',
        'permalink',
        'title',
        'price',
        'type',
        'category_id',
        'shipping',
        'template_custom',
        'status',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'type'     => 'string',
        'shipping' => 'string'
    ];

    /**
     * @return Template
     */
    public function template()
    {
        return $this->hasOne(Template::class);
    }

    /**
     * @return Product
     */
    public function product()
    {
        return $this->belongsTo(Produto::class, 'product_sku', 'sku');
    }

    /**
     * Return type description
     *
     * @return string
     */
    public function getTypeDescriptionAttribute()
    {
        switch ($this->type) {
            case 1:
                return 'gold_pro'; // Premium
            default:
                return 'gold_special'; // Clássico
        }
    }
}
