<?php namespace Core\Models\Pedido;

use Carbon\Carbon;
use App\Models\Usuario\Usuario;
use Core\Models\Pedido;

/**
 * Class Comentario
 * @package Core\Models\Pedido
 */
class Comentario extends \Eloquent
{
    protected $table = 'pedido_comentarios';

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
}
