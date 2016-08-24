<?php namespace App\Models;

/**
 * Class LinhaAtributo
 * @package App\Models
 */
class LinhaAtributo extends \Eloquent
{
    /**
     * @var array
     */
    protected $fillable = [
        'titulo',
        'tipo',
        'opcoes'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $casts = [
        'tipo' => 'string',
    ];

    /**
     * Linha
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function linha()
    {
        return $this->belongsTo(Linha::class);
    }
}