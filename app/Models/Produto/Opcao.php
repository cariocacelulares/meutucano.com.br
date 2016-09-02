<?php namespace App\Models\Produto;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Opcao
 * @package App\Models\Produto
 */
class Opcao extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'linha_atributo_opcoes';

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'valor',
        'atributo_id',
    ];

    /**
     * Atributo
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function atributo()
    {
        return $this->belongsTo(Atributo::class);
    }
}