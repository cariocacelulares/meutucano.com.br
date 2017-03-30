<?php namespace Core\Models;

use Core\Models\Pedido;
use Sofa\Eloquence\Eloquence;
use Core\Models\Stock\Entry;

/**
 * Class Supplier
 * @package Core\Models
 */
class Supplier extends \Eloquent
{
    use Eloquence;

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
     * Entry
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entries()
    {
        return $this->hasMany(Entry::class);
    }
}
