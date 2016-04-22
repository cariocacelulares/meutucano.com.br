<?php namespace App\Models;

/**
 * Class Cliente
 * @package App\Models
 */
class Cliente extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'taxvat',
        'tipo',
        'nome',
        'fone',
        'email',
        'inscricao'
    ];

    /**
     * Endereços
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function enderecos()
    {
        return $this->hasMany(ClienteEndereco::class);
    }
}
