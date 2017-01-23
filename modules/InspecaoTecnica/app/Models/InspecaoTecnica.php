<?php namespace InspecaoTecnica\Models;

use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use Core\Models\Produto;
use Core\Models\Pedido\PedidoProduto;

/**
 * Class InspecaoTecnica
 * @package InspecaoTecnica\Models
 */
class InspecaoTecnica extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'inspecao_tecnica';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'usuario_id',
        'solicitante_id',
        'produto_sku',
        'pedido_produtos_id',
        'descricao',
        'priorizado',
        'reservado',
        'revisado_at',
    ];

    /**
     * Usuario
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * Solicitante
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function solicitante()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * Produto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function produto()
    {
        return $this->hasOne(Produto::class, 'sku', 'produto_sku');
    }

    /**
     * PedidoProduto
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido_produto()
    {
        return $this->hasOne(PedidoProduto::class, 'id', 'pedido_produtos_id');
    }
}
