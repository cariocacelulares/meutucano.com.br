<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class PedidoComentario
 * @package App\Models
 */
class PedidoComentario extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'usuario_id',
        'comentario',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
        'created_at_diff_readable',
    ];

    /**
     * @var array
     */
    protected $with = [
        'usuario',
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Usuário
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    /**
     * Return readable created_at diff
     *
     * @return string
     */
    protected function getCreatedAtDiffReadableAttribute()
    {
        Carbon::setLocale(config('app.locale'));
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->diffForHumans();
    }
}
