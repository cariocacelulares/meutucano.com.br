<?php namespace Core\Models\Pedido;

use App\Models\Usuario\Usuario;
use Core\Models\Pedido;

/**
 * Class Ligacao
 * @package Core\Models\Pedido
 */
class Ligacao extends \Eloquent
{
    protected $table = 'pedido_ligacoes';

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'usuario_id',
        'arquivo',
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

    public function getArquivoAttribute($arquivo)
    {
        return "/storage/{$arquivo}";
    }
}
