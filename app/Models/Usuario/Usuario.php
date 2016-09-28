<?php namespace App\Models\Usuario;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;

/**
 * Class Usuario
 * @package App\Models\Usuario
 */
class Usuario extends Authenticatable
{
    use EntrustUserTrait;

    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'remember_token',
    ];

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
}