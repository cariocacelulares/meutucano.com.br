<?php namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Pedido
 * @package App\Models
 */
class Pedido extends \Eloquent
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
    protected $fillable = ['*'];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
        'marketplace_readable',
        'status_description',
        'can_prioritize',
        'can_hold',
    ];

    /**
     * @var array
     */
    protected $with = [
        'cliente',
        'endereco',
        'nota',
        'rastreios',
        'produtos',
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
     * Comentários
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comentarios()
    {
        return $this->hasMany(PedidoComentario::class)->orderBy('created_at');
    }

    /**
     * Retorna o status de um pedido legível
     * 
     * @return string 
     */
    protected function getStatusDescriptionAttribute()
    {
        return ($this->status) ? \Config::get('tucano.pedido_status')[$this->status] : 'Desconhecido';
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute() 
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    /**
     * Return readable marketplace description
     * 
     * @return string 
     */
    protected function getMarketplaceReadableAttribute() 
    {
        switch ($this->marketplace) {
            case 'WALMART':
                return 'Walmart';
            case 'MERCADOLIVRE':
                return 'ML ' . ucfirst(strtolower($this->marketplace_adicional));
            default:
                return $this->marketplace;
        }
    }

    /**
     * Return can_hold
     *
     * @return string
     */
    protected function getCanHoldAttribute() 
    {
        switch ($this->status) {
            case 0: 
            case 1: 
                return true;
            default:
                return false;
        }
    }

    /**
     * Return can_prioritize
     *
     * @return string
     */
    protected function getCanPrioritizeAttribute() 
    {
        switch ($this->status) {
            case 0: 
            case 1: 
                return true;
            default:
                return false;
        }
    }
}
