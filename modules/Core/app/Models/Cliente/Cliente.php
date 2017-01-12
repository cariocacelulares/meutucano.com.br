<?php namespace Core\Models\Cliente;

use Carbon\Carbon;
use Core\Models\Pedido\Pedido;
use Sofa\Eloquence\Eloquence;

/**
 * Class Cliente
 * @package Core\Models\Cliente
 */
class Cliente extends \Eloquent
{
    use Eloquence;

    /**
     * @var array
     */
    protected $fillable = [
        'taxvat',
        'tipo',
        'nome',
        'fone',
        'email',
        'inscricao',
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    /**
     * Endereços
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enderecos()
    {
        return $this->hasMany(Endereco::class);
    }
}
