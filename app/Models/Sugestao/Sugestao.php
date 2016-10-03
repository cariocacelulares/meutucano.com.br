<?php namespace App\Models\Sugestao;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;
use App\Models\Usuario\Usuario;

/**
 * Class Sugestao
 * @package App\Models\Sugestao
 */
class Sugestao extends \Eloquent
{
    use RevisionableTrait;

    protected $table = 'sugestoes';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'usuario_id',
        'anonimo',
        'setor',
        'pessoa',
        'descricao',
        'status',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
    ];

    /**
     * Usuario
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
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

    /**
     * @return string
     */
    public function getStatusDescriptionAttribute() {
        switch ($this->status) {
            case '1':
                return 'Acatada';
            case '2':
                return 'Arquivada';
            default:
                return 'Pendente';
        }
    }
}