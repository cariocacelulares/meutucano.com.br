<?php namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Linha
 * @package App\Models
 */
class Linha extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'titulo'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
    ];

    /**
     * @var array
     */
    protected $with = [
        'atributos'
    ];

    /**
     * Atributos
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function atributos()
    {
        return $this->hasMany(LinhaAtributo::class);
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
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}