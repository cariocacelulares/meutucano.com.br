<?php namespace Core\Models\Stock;

use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use Core\Models\Produto\ProductImei;

/**
 * Issue model
 * @package Core\Models
 */
class Issue extends Model
{
    use RevisionableTrait;

    protected $table = 'stock_issues';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'product_imei_id',
        'reason',
        'description',
    ];

    /**
     * Usuario
     * @return Usuario
     */
    public function user()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * ProductImei
     * @return ProductImei
     */
    public function productImei()
    {
        return $this->belongsTo(ProductImei::class)->withTrashed();
    }
}
