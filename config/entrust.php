<?php

return [
    'role' => \App\Models\Usuario\Role::class,
    'roles_table' => 'roles',
    'role_user_table' => 'role_user',

    'permission' => \App\Models\Usuario\Permission::class,
    'permissions_table' => 'permissions',
    'permission_role_table' => 'permission_role',
    'permission_user_table' => 'permission_user',

    'user_foreign_key' => 'user_id',
    'role_foreign_key' => 'role_id',
    'permission_foreign_key' => 'permission_id',
];
