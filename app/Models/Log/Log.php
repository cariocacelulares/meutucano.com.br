<?php namespace App\Models\Log;

/**
 * Class Log
 * @package App\Models\Log
 */
class Log extends \Moloquent
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'tipo',
        'stack'
    ];
}