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
        'opcoes',
        'linha_id'
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

    public function getOpcoesAttribute($opcoes)
    {
        $opcoes = explode(';', $opcoes);

        if (count($opcoes) === 1 && $opcoes[0] === '')
            $opcoes = null;

        return $opcoes;
    }
}