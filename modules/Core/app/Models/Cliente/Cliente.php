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
     * @var array
     */
    protected $appends = [
        'taxvat_readable'
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

                if (in_array($i, [1, 4])) {
                    $format[] = '.';
                } elseif ($i == 6) {
                    $format[] = '/';
                } elseif ($i == 11) {
                    $format[] = '-';
                }
            }
        } else {
            // CPF
            for ($i = 0; $i < strlen($taxvat); $i++) {
                $format[] = $taxvat[$i];

                if (in_array($i, [2, 5])) {
                    $format[] = '.';
                } elseif ($i == 8) {
                    $format[] = '-';
                }
            }
        }

        return implode('', $format);
    }

    /**
     * @return string
     */
    public function getCreatedAtAttribute($created_at)
    {
        if (!$created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->format('d/m/Y H:i');
    }

    /**
     * @return string
     */
    public function getUpdatedAtAttribute($updated_at)
    {
        if (!$updated_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $updated_at)->format('d/m/Y H:i');
    }
}
