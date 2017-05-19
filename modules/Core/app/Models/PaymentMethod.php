<?php namespace Core\Models;

class PaymentMethod extends \Eloquent
{
    /**
     * @var string
     */
    public $primaryKey = 'slug';

    /**
     * @var boolean
     */
    public $incrementing = false;

    /**
     * @var boolean
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'slug',
        'title',
        'installments',
    ];
}
