<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class Pedido
 * @package App\Models
 */
class Pedido extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'id',
        'cliente_id',
        'cliente_endereco_id',
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
     * Nota fiscal
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function nota()
    {
        return $this->hasOne('App\Models\PedidoNota');
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
