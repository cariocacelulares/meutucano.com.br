<?php namespace Core\Models\Stock;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use Core\Models\Supplier;
use Core\Models\Stock\Entry\Product;
use Core\Models\Stock\Entry\Invoice;

/**
 * Entry model
 * @package Core\Models\Stock
 */
class Entry extends Model
{
    use SoftDeletes,
        RevisionableTrait;

    protected $table = 'stock_entries';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'supplier_id',
        'description',
        'confirmed_at',
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
     * Supplier
     * @return Supplier
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Invoice
     * @return Invoice
     */
    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'stock_entry_id', 'id');
    }

    /**
     * Product
     * @return Product
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'stock_entry_id', 'id');
    }
}
