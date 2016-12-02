<?php namespace Allnation\Models;

use Core\Models\Produto\Produto;
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
        'produto_sku',
        'allnation_id'
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