<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class Cliente
 * @package App\Models
 */
class Cliente extends \Eloquent
{
    /**
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
        'taxvat_readable',
        'last_endereco',
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
        return $this->hasMany(ClienteEndereco::class);
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    /**
     * Return readable taxvat_readable
     *
     * @return string
     */
    protected function getTaxvatReadableAttribute()
    {
        $taxvat = $this->taxvat;
        $taxvat = preg_replace('/\D/', '', $taxvat);
        $format = [];

        if ((int)$this->tipo === 1) {
            // CNPJ
            for ($i = 0; $i < strlen($taxvat); $i++) {
                $format[] = $taxvat[$i];

                if (in_array($i, [1, 4]))
                    $format[] = '.';
                else if ($i == 6)
                    $format[] = '/';
                else if ($i == 11)
                    $format[] = '-';
            }
        } else {
            // CPF
            for ($i = 0; $i < strlen($taxvat); $i++) {
                $format[] = $taxvat[$i];

                if (in_array($i, [2, 5]))
                    $format[] = '.';
                else if ($i == 8)
                    $format[] = '-';
            }
        }

        return implode('', $format);
    }

    /**
     * Return last endereco
     *
     * @return string
     */
    protected function getLastEnderecoAttribute() {
        return $this->enderecos->last();
    }
}