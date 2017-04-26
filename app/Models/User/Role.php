<?php namespace App\Models\User;

use Carbon\Carbon;
use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{
    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * @var array
     */
    protected $visible = [
        'id',
        'name',
        'display_name',
        'perms'
    ];
}
