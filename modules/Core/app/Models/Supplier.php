<?php namespace Core\Models;

class Supplier extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'company_name',
        'name',
        'cnpj',
        'ie',
        'crt',
        'fone',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'uf',
        'cep',
        'country',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entries()
    {
        return $this->hasMany(DepotEntry::class);
    }
}
