<?php namespace Core\Models\Pedido\Nota;

use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;
use Core\Models\Pedido\Nota;

/**
 * Class Devolucao
 * @package Core\Models\Pedido\Nota
 */
class Devolucao extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_nota_devolucoes';

    /**
     * @var array
     */
    protected $fillable = [
        'nota_id',
        'chave',
        'arquivo',
        'tipo',
        'data',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'tipo_readable',
    ];

    /**
     * Nota
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function nota()
    {
        return $this->belongsTo(Nota::class);
    }

    /**
     * Return tipo readable
     *
     * @return string
     */
    public function getTipoReadableAttribute()
    {
        return ($this->tipo == 1) ? 'Estorno' : 'Devolução';
    }
}
