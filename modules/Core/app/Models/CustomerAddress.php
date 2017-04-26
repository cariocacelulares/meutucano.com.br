<?php namespace Core\Models;

use Venturecraft\Revisionable\RevisionableTrait;

class CustomerAddress extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'zipcode',
        'street',
        'number',
        'complement',
        'district',
        'city',
        'state',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
