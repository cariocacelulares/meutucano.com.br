<?php namespace Core\Models;

class Supplier extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'company_name',
        'name',
        'taxvat',
        'document',
        'crt',
        'phone',
        'street',
        'number',
        'complement',
        'district',
        'city',
        'state',
        'zipcode',
        'country',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depotEntries()
    {
        return $this->hasMany(DepotEntry::class);
    }
}
