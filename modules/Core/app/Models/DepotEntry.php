<?php namespace Core\Models;

use App\Models\User\User;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class DepotEntry extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

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
        'shipment_method',
        'shipment_cost',
        'payment_method',
        'installments',
        'taxes',
        'discount',
        'description',
        'confirmed_at',
    ];

    /**
     * @return array
     */
    protected $hidden = [
        'productsSummary'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'total',
        'quantity',
        'confirmed'
    ];

    /**
     * Return if entry was confirmed
     *
     * @return void
     */
    public function getConfirmedAttribute()
    {
        return ($this->confirmed_at) ? true : false;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function invoice()
    {
        return $this->hasOne(DepotEntryInvoice::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(DepotEntryProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productsSummary()
    {
        return $this->hasMany(DepotEntryProduct::class)
            ->selectRaw('depot_entry_products.depot_entry_id, sum(quantity) as quantity, (quantity * unitary_value) as total')
            ->groupBy('depot_entry_id');
    }

    /**
     * Return total value from entry
     *
     * @return int
     */
    public function getTotalAttribute()
    {
        if (!array_key_exists('productsSummary', $this->relations)) {
            return;
        }

        $related = $this->getRelation('productsSummary')->first();
        return $related ? (float) $related->total : 0;
    }

    /**
     * Return quantity of products from entry
     *
     * @return int
     */
    public function getQuantityAttribute()
    {
        if (!array_key_exists('productsSummary', $this->relations)) {
            return;
        }

        $related = $this->getRelation('productsSummary')->first();
        return $related ? (int) $related->quantity : 0;
    }
}
