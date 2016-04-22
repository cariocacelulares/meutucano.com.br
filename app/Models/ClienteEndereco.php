<?php namespace App\Models;

/**
 * Class ClienteEndereco
 * @package App\Models
 */
class ClienteEndereco extends \Eloquent
{
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
        'uf'
    ];

    protected $appends = [
        'cep_readable'
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

    /**
     * Return readable CEP
     *
     * @return string
     */
    protected function getCepReadableAttribute() {
        return substr($this->cep, 0, 5) . '-' . substr($this->cep, -3);
    }
}
