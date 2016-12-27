<?php namespace Core\Models\Pedido;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Rastreio\Models\Rastreio;

/**
 * Class Pedido
 * @package Core\Models\Pedido
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
    protected $fillable = [
        'cliente_id',
        'cliente_endereco_id',
        'codigo_api',
        'frete_valor',
        'frete_metodo',
        'pagamento_metodo',
        'pagamento_parcelas',
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
        'priorizado'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'marketplace_readable',
        'status_description',
        'can_prioritize',
        'can_hold',
        'can_cancel',
        'pagamento_metodo_readable',
        'frete_metodo_readable',
        'desconto'
    ];

    /**
     * @var [type]
     */
    protected $casts = [
        'status' => 'string'
    ];

    /**
     * Nota fiscal
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasMany
     */
    public function notas()
    {
        return $this->hasMany(Nota::class);
    }

    /**
     * Imposto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function imposto()
    {
        return $this->hasOne(Imposto::class);
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
        return $this->hasMany(Rastreio::class);
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
        return $this->hasOne(Endereco::class, 'id', 'cliente_endereco_id');
    }

    /**
     * Comentários
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comentarios()
    {
        return $this->hasMany(Comentario::class)->orderBy('created_at');
    }

    /**
     * Retorna o status de um pedido legível
     *
     * @return string
     */
    protected function getStatusDescriptionAttribute()
    {
        if (!isset(\Config::get('core.pedido_status')[$this->status])) {
            return 'Desconhecido';
        } else {
            return \Config::get('core.pedido_status')[$this->status];
        }
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
                return 'Mercado Livre';
            default:
                return $this->marketplace;
        }
    }

    /**
     * Return readable payment method description
     *
     * @return string
     */
    protected function getPagamentoMetodoReadableAttribute()
    {
        $metodo = strtolower($this->pagamento_metodo);

        if (!$metodo) {
            return null;
        }

        switch ($metodo) {
            case 'credito':
                $metodo = 'cartão de crédito';
                break;
            case 'debito':
                $metodo = 'cartão de débito';
                break;
            case 'boleto':
                $metodo = 'boleto';
                break;
            default:
                $metodo = 'outro meio';
                break;
        }

        return 'Pagamento via ' . $metodo;
    }

    /**
     * Return readable shipment method description
     *
     * @return string
     */
    protected function getFreteMetodoReadableAttribute()
    {
        $metodo = strtolower($this->frete_metodo);

        if (!$metodo) {
            return null;
        }

        switch ($metodo) {
            case 'pac':
                $metodo = 'PAC';
                break;
            case 'sedex':
                $metodo = 'SEDEX';
                break;
            default:
                $metodo = 'outro meio';
                break;
        }

        return 'Envio via ' . $metodo;
    }

    /**
     * Return can_hold
     *
     * @return string
     */
    protected function getCanHoldAttribute()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Return can_prioritize
     *
     * @return string
     */
    protected function getCanPrioritizeAttribute()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Return can_cancel
     *
     * @return string
     */
    protected function getCanCancelAttribute()
    {
        if (in_array($this->status, [0,1])) {
            return true;
        }

        return false;
    }

    /**
     * Return order discount
     *
     * @return string
     */
    protected function getDescontoAttribute()
    {
        $frete = ($this->frete_valor) ?: 0;
        $total = 0;
        foreach ($this->produtos as $produto) {
            $total += $produto->total;
        }

        if (($this->total - $frete) != $total) {
            return round(100 - ((($this->total - $frete) * 100) / $total));
        }

        return null;
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at)
    {
        if (!$created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at)
    {
        if (!$updated_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getEstimatedDeliveryAttribute($estimated_delivery)
    {
        if (!$estimated_delivery) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d', $estimated_delivery)->format('d/m/Y');
    }
}
