<?php namespace Core\Models;

use Rastreio\Models\Rastreio;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class Order extends \Eloquent
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
    protected $fillable = [
        'cliente_id',
        'cliente_endereco_id',
        'codigo_api',
        'frete_valor',
        'frete_metodo',
        'pagamento_metodo',
        'parcelas',
        'codigo_marketplace',
        'marketplace',
        'operacao',
        'total',
        'estimated_delivery',
        'status',
        'protocolo',
        'imagem_cancelamento',
        'segurado',
        'reembolso',
        'priorizado',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'status' => 'string',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\hasMany
     */
    public function invoices()
    {
        return $this->hasMany(OrderInvoice::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function taxes()
    {
        return $this->hasOne(OrderTax::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(OrderProduct::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function shipments()
    {
        return $this->hasMany(Rastreio::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function customerAddress()
    {
        return $this->belongsTo(CustomerAddress::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(OrderComment::class)->orderBy('created_at');
    }

    /**
     * Define if a order can be holded
     *
     * @return boolean
     */
    public function getCanHold()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Defide if a order can be prioritized
     *
     * @return boolean
     */
    public function getCanPrioritize()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Define if a order can be canceled
     *
     * @return boolean
     */
    public function getCanCancel()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Calculate discount percent based in order products: 100 - ((valor - shipping) * 100 / totalProducts)
     *
     * @return null|int
     */
    public function getDesconto()
    {
        if (strtolower($this->marketplace) === 'b2w') {
            $frete = ($this->frete_valor) ?: 0;
            $totalProdutos = 0;
            foreach ($this->produtos as $produto) {
                $totalProdutos += $produto->valor;
            }

            if ($totalProdutos > 0 && ($this->total - $frete) != $totalProdutos) {
                return round(100 - ((($this->total - $frete) * 100) / $totalProdutos));
            }
        }

        return null;
    }
}
