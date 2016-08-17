<?php namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;

/**
 * Class Usuario
 * @package App\Models
 */
class Usuario extends Authenticatable
{
    use EntrustUserTrait;

    /**
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * @var array
     */
    protected $hidden = [
        'password', 
        'remember_token',
    ];

    /**
     * @var array
     */
    protected $with = [
        'roles'
    ];
}
