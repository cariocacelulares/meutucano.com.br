<?php namespace Core\Models;

use Core\Models\Pedido;
use Sofa\Eloquence\Eloquence;
use Core\Models\CustomerAddress;

class Customer extends \Eloquent
{
    use Eloquence;

    /**
     * @var array
     */
    protected $fillable = [
        'taxvat',
        'name',
        'phone',
        'email',
        'document',
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function($customer) {
            $customer->taxvat = numbers($customer->taxvat);
            $customer->type   = (strlen($customer->taxvat) > 11) ? 1 : 0;
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }
}
