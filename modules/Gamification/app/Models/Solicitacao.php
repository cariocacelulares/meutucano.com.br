<?php namespace Gamification\Models;

use Carbon\Carbon;
use App\Models\Usuario\Usuario;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Solicitacao
 * @package Gamification\Models
 */
class Solicitacao extends \Eloquent
{
    use SoftDeletes;

    protected $table = 'gamification_solicitacoes';

    protected $fillable = [
        'id',
        'usuario_id',
        'tarefa_id',
        'descricao',
        'status',
    ];

    protected $appends = [
        'created_at_readable',
        'updated_at_readable',
        'status_readable'
    ];

    protected $with = [
        'tarefa'
    ];

    public function tarefa()
    {
        return $this->belongsTo(Tarefa::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    protected function getStatusReadableAttribute()
    {
        if (is_null($this->status)) {
            return 'Pendente';
        }

        return ($this->status === 1) ? 'Aprovado' : 'Rejeitado';
    }

    protected function getCreatedAtReadableAttribute()
    {
        if (!$this->created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }

    protected function getUpdatedAtReadableAttribute()
    {
        if (!$this->created_at) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y H:i');
    }
}
