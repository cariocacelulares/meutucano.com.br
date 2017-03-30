<?php namespace Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Rastreio\Models\Rastreio;
use Core\Models\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Pedido\Comentario;

/**
 * Class Pedido
 * @package Core\Models
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
