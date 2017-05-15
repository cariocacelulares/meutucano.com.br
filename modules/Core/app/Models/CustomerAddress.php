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

    protected $appends = [
        'address'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Return full address attribute
     *
     * @return string
     */
    public function getAddressAttribute()
    {
        return "{$this->street} #{$this->number} - {$this->district} <br>
            {$this->city} / {$this->state} <br>
            {$this->zipcode} <br>
            {$this->complement}";
    }
}
