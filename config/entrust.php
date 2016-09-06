<?php

return [

    'role' => \App\Models\Usuario\Role::class,
    'roles_table' => 'roles',
    'role_user_table' => 'role_user',

    'user_foreign_key' => 'user_id',
    'role_foreign_key' => 'role_id',
];
