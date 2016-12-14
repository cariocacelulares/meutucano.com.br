<?php namespace Core\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Produto\Linha\Atributo;

/**
 * Class Linha
 * @package Core\Models\Produto
 */
class Linha extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'titulo',
        'ncm_padrao',
    ];

    /**
     * Atributos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function atributos()
    {
        return $this->hasMany(Atributo::class);
    }

    /**
     * Produtos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function produtos()
    {
        return $this->hasMany(Produto::class);
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