<?php namespace Core\Models;

class Invoice extends \Eloquent
{
    /**
     * @return array
     */
    protected $fillable = [
        'invoiceable_type',
        'invoiceable_id',
        'number',
        'series',
        'cfop',
        'key',
        'file',
        'issued_at',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function invoiceable()
    {
        return $this->morphTo();
    }
}
