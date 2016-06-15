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

    /**
     * @var array
     */
    protected $appends = [
        'cep_readable'
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

    /**
     * Return readable CEP
     *
     * @return string
     */
    protected function getCepReadableAttribute() {
        if (strlen($this->cep) == 8) {
            return substr($this->cep, 0, 5) . '-' . substr($this->cep, -3);
        } elseif (strlen($this->cep) == 7) {
            $this->cep = '0' . $this->cep;

            return $this->getCepReadableAttribute();
        }
    }
}
