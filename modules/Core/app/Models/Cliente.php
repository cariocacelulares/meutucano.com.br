<?php namespace Core\Models;

use Carbon\Carbon;
use Core\Models\Pedido;
use Sofa\Eloquence\Eloquence;
use Core\Models\Cliente\Endereco;

/**
 * Class Cliente
 * @package Core\Models
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
