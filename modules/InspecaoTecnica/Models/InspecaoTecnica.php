<?php namespace Modules\InspecaoTecnica\Models;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use App\Models\Produto\Produto;
use App\Models\Pedido\PedidoProduto;

/**
 * Class InspecaoTecnica
 * @package Modules\InspecaoTecnica\Models
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
     * @var array
     */
    protected $appends = [
        'revisado_at_readable',
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

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at) {
        if (!$created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        if (!$updated_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getRevisadoAtReadableAttribute() {
        if (!$this->revisado_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->revisado_at)->format('d/m/Y H:i');
    }
}