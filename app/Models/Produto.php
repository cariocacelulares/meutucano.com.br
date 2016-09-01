<?php namespace App\Models;

use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Produto
 * @package App\Models
 */
class Produto extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var string
     */
    protected $primaryKey = 'sku';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    protected $fillable = [
        'marca_id',
        'linha_id',
        'titulo',
        'ncm',
        'ean',
        'referencia',
        'unidade',
        'controle_serial',
        'ativo',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'ativo' => 'string',
    ];

    /**
     * @var array
     */
    protected $with = [
        'linha',
        'marca',
    ];

    /**
     * Linha
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function linha()
    {
        return $this->belongsTo('App\Models\Linha');
    }

    /**
     * Marca
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function marca()
    {
        return $this->belongsTo('App\Models\Marca');
    }
}