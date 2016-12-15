<?php namespace App\Models\Usuario;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

/**
 * Class Senha
 * @package App\Models\Usuario
 */
class Senha extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'usuario_senhas';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'usuario_id',
        'site',
        'url',
        'usuario',
        'senha',
    ];

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
