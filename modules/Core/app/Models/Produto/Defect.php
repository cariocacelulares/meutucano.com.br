<?php namespace Core\Models\Produto;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto;

/**
 * Class Defect
 * @package Core\Models\Pedido
 */
class Defect extends Model
{
    use RevisionableTrait;

    protected $table = 'product_defects';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'product_sku',
        'product_imei_id',
        'description',
    ];

    /**
     * Produto
     * @return Produto
     */
    public function product()
    {
        return $this->belongsTo(Produto::class);
    }

    /**
     * ProductImei
     * @return ProductImei
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class);
    }
}
