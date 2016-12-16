<?php namespace Magento\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class MagentoCategory
 * @package Magento\Models
 */
class MagentoCategory extends Model
{
    /**
    * @var array
    */
    protected $fillable = [
        'id',
        'magento_category_id',
        'name',
    ];

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * Parent category
     *
     * @return BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(MagentoCategory::class);
    }
}
