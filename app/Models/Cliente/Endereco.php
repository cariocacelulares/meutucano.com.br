<?php namespace App\Models\Cliente;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Endereco
 * @package App\Models\Cliente
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

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at) {
        if (!$created_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at) {
        if (!$updated_at)
            return null;

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}