<?php namespace App\Models;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class ClienteEndereco
 * @package App\Models
 */
class ClienteEndereco extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var array
     */
    protected $guarded = ['id'];

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
