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

    /*
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
    */

    /**
     * @var array
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
}
