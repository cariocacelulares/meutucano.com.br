<?php namespace Modules\Core\Models\Pedido\Rastreio;

use Venturecraft\Revisionable\RevisionableTrait;
use Modules\Core\Models\Pedido\Rastreio;
use App\Models\Usuario\Usuario;

/**
 * Class Monitorado
 * @package Modules\Core\Models\Pedido\Rastreio
 */
class Monitorado extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_rastreio_monitorados';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'rastreio_id',
        'usuario_id',
    ];

    /**
     * Rastreio
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rastreio()
    {
        return $this->belongsTo(Rastreio::class);
    }

    /**
     * Usuario
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}