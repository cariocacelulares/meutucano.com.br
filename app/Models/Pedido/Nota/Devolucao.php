<?php namespace App\Models\Pedido\Nota;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Pedido\Pedido;
use App\Models\Usuario\Usuario;
use App\Models\Pedido\Nota;

/**
 * Class Devolucao
 * @package App\Models\Pedido\Nota
 */
class Devolucao extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'pedido_nota_devolucoes';

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
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
        'numero',
        'serie',
        'tipo_readable'
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

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
     * Return numero attribute
     *
     * @return string
     */
    public function getNumeroAttribute()
    {
        return (int) (substr($this->chave, 25, 9)) ?: $this->pedido_id;
    }

    /**
     * Return serie attribute
     *
     * @return string
     */
    public function getSerieAttribute()
    {
        return (substr($this->pedido_id, -1)) ?: 1;
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

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getDataAttribute($data)
    {
        return Carbon::createFromFormat('Y-m-d', $data)->format('d/m/Y');
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