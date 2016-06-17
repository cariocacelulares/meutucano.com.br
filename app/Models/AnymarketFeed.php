<?php namespace App\Models;

use Carbon\Carbon;

/**
 * Class AnymarketFeed
 * @package App\Models
 */
class AnymarketFeed extends \Eloquent
{

    /**
     * @var array
     */
    protected $fillable = [
        'id',
        'tipo',
    ];

    /**
     * @var array
     */
    protected $appends = [
        'created_at_readable',
        'tipo_description'
    ];

    /**
     * Return readable tipo
     *
     * @return string
     */
    protected function getTipoDescriptionAttribute()
    {
        switch ($this->tipo) {
            case 0:
                return 'Pedidos';
            default:
                return 'Geral';
        }
    }

    /**
     * Return readable created_at
     *
     * @return string
     */
    protected function getCreatedAtReadableAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->format('d/m/Y');
    }
}
