<?php namespace App\Models\Usuario;

use Carbon\Carbon;
use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
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
        'display_name'
    ];
}
