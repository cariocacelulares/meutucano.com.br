<?php namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Pedido
 * @package App\Models
 */
class Pedido extends \Eloquent
{
    use SoftDeletes;

    /**
     * @var array
     */
    protected $fillable = [
        'id',
        'cliente_id',
        'cliente_endereco_id',
        'codigo_anymarket',
        'frete_anymarket',
        'codigo_marketplace',
        'marketplace',
        'marketplace_adicional',
        'operacao',
        'total'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable'
    ];

    /**
     * Set soft delete cascade
     */
    protected static function boot() {
        parent::boot();

        static::deleting(function($pedido) {
            $pedido->nota()->delete();
            $pedido->rastreios()->delete();
        });

        static::restoring(function($pedido) {
            $pedido->nota()->withTrashed()->restore();
            $pedido->rastreios()->withTrashed()->restore();
        });
    }

    /**
     * Nota fiscal
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function nota()
    {
        return $this->hasOne('App\Models\PedidoNota');
    }

    /**
     * Imposto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function imposto()
    {
        return $this->hasOne('App\Models\PedidoImposto');
    }

    /**
     * Produtos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function produtos()
    {
        return $this->hasMany(PedidoProduto::class);
    }

    /**
     * Rastreio
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function rastreios()
    {
        return $this->hasMany(PedidoRastreio::class);
    }

    /**
     * Cliente
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Cliente
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function endereco()
    {
        return $this->hasOne(ClienteEndereco::class, 'id', 'cliente_endereco_id');
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y');
    }
}
