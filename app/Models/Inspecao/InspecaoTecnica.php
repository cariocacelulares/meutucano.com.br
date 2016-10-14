<?php namespace App\Models\Inspecao;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use App\Models\Pedido\PedidoProduto;

/**
 * Class InspecaoTecnica
 * @package App\Models\Inspecao
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
        'pedido_produtos_id',
        'imei',
        'descricao',
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
     * PedidoProduto
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasOne
     */
    public function pedido_produto()
    {
        return $this->hasOne(PedidoProduto::class);
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
}