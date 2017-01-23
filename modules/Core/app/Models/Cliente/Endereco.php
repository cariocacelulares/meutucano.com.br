<?php namespace Core\Models\Cliente;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Cliente;

/**
 * Class Endereco
 * @package Core\Models\Cliente
 */
class Endereco extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'cliente_enderecos';

    /**
     * @var array
     */
    protected $fillable = [
        'cliente_id',
        'cep',
        'rua',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'cep' => 'string'
    ];

    /**
     * Cliente
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
