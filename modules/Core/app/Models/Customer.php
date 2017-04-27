<?php namespace Core\Models;

class Customer extends \Eloquent
{
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
