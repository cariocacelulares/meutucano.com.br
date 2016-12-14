<?php namespace Rastreio\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;
use Core\Models\Pedido\Pedido;
use Rastreio\Http\Controllers\RastreioController;

/**
 * Class Rastreio
 * @package Rastreio\Models
 */
class Rastreio extends \Eloquent
{
    use SoftDeletes,
        RevisionableTrait;

    protected $table = 'pedido_rastreios';

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'pedido_id',
        'data_envio',
        'rastreio',
        'servico',
        'valor',
        'prazo',
        'status',
        'imagem_historico'
    ];

    /**
     * @var array
     */
    protected $appends = [
        'status_description',
        'tipo_description',
        'data_envio_readable',
        'prazo_date',
        'rastreio_url',
        'monitorado',
    ];

    /**
     * @var [type]
     */
    protected $casts = [
        'status' => 'string'
    ];

    /**
     * Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Pedido de informação
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pi()
    {
        return $this->hasOne(Pi::class);
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function devolucao()
    {
        return $this->hasOne(Devolucao::class);
    }

    /**
     * Devolução
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function logistica()
    {
        return $this->hasOne(Logistica::class);
    }

    /**
     * Monitorado
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function monitoramentos()
    {
        return $this->hasMany(Monitorado::class);
    }

    /**
     * Rastreio de referência do pedido de informação
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rastreioRef()
    {
        return $this->belongsTo(Rastreio::class);
    }

    /**
     * Return description from status
     *
     * @return string
     */
    public function getStatusDescriptionAttribute()
    {
        return ($this->status > 0) ? \Config::get('rastreio.status')[$this->status] : 'Pendente';
    }

    /**
     * Return description from tipo
     *
     * @return string
     */
    public function getTipoDescriptionAttribute()
    {
        switch ($this->tipo) {
            case 1:
                return 'Devolução';
            case 2:
                return 'Reenvio por extravio';
            case 3:
                return 'Logística reversa';
            default:
                return 'Padrão';
        }
    }

    /**
     * Return readable CEP
     *
     * @return string
     */
    public function getDataEnvioReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d', $this->data_envio)->format('d/m/Y');
    }

    /**
     * Retorna o prazo em formato de data
     *
     * @return string
     */
    public function getPrazoDateAttribute()
    {
        return \SomaDiasUteis($this->getDataEnvioReadableAttribute(), $this->prazo);
    }

    /**
     * Retorna a URL para rastreio
     *
     * @return string
     */
    public function getRastreioUrlAttribute()
    {
        return sprintf(
            'http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS=%s',
            $this->rastreio
        );
    }

    public function getMonitoradoAttribute()
    {
        return !!$this->monitoramentos()->where('usuario_id', '=', getCurrentUserId())->first();
    }

    /**
     * Retorna o cep do endereço do pedido
     *
     * @return int|string
     */
    public function getCep()
    {
        return $this->pedido->endereco->cep;
    }
}