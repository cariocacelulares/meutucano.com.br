<?php namespace App\Models\Usuario;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Notifications\Notifiable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class Usuario
 * @package App\Models\Usuario
 */
class Usuario extends Authenticatable
{
    use EntrustUserTrait, Notifiable;

    /**
     * @var array
     */
    protected $fillable = [
        'id',
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
        'perms'
    ];

    /**
     * @return array
     */
    protected $appends = [
        'permissions'
    ];

    /**
     * User permissions
     *
     * @return array
     */
    public function perms()
    {
        return $this->belongsToMany(Permission::class,
            config('entrust.permission_user_table'), 'user_id');
    }

    /**
     * Get all user and role permissions
     * @return array
     */
    public function getPermissionsAttribute()
    {
        $userPrimaryKey = $this->primaryKey;
        $cacheKey = implode('_', [$this->getTable(), $this->$userPrimaryKey]);

        return Cache::tags('entrust')->remember($cacheKey, config('cache.ttl'), function () {
            $permissions = [];

            foreach ($this->cachedRoles() as $role) {
                $permissions = array_merge(
                    $permissions,
                    $role->cachedPermissions()->pluck('name')->toArray()
                );
            }

            $permissions = array_merge($permissions,
                $this->perms->pluck('name')->toArray());

            return $permissions;
        });
    }

    /**
     * Atualiza o password com hash
     *
     * @param string $pass
     */
    public function setPasswordAttribute($pass)
    {
        $this->attributes['password'] = bcrypt($pass);
    }

    /**
     * Check if user has a permission by its name.
     *
     * @param string|array $permission
     * @param bool         $requireAll
     *
     * @return bool
     */
    public function can($permission, $requireAll = false)
    {
        if (is_array($permission)) {
            foreach ($permission as $permName) {
                $hasPerm = $this->can($permName);
                if ($hasPerm && !$requireAll) {
                    return true;
                } elseif (!$hasPerm && $requireAll) {
                    return false;
                }
            }

            return $requireAll;
        } else {
            // Check permissions from role
            foreach ($this->cachedRoles() as $role) {
                foreach ($role->cachedPermissions() as $perm) {
                    if (str_is($permission, $perm->name)) {
                        return true;
                    }
                }
            }

            // Check permissions from user
            foreach ($this->permissions as $perm) {
                if (str_is($permission, $perm)) {
                    return true;
                }
            }
        }

        return false;
    }
}
