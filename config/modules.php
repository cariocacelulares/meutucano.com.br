<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Module Namespace
    |--------------------------------------------------------------------------
    |
    | Default module namespace.
    |
    */

    'namespace' => 'Modules',

    /*
    |--------------------------------------------------------------------------
    | Module Stubs
    |--------------------------------------------------------------------------
    |
    | Default module stubs.
    |
    */

    'stubs'     => [
        'enabled' =>    false,
        'path'    =>   base_path() . '/vendor/nwidart/laravel-modules/src/Commands/stubs',
        'files'   => [
            'start'           => 'bootstrap.php',
            'routes'          => 'app/Http/routes.php',
            'json'            => 'module.json',
            'scaffold/config' => 'config/config.php',
            // 'views/index'  => 'resources/views/index.blade.php',
            // 'views/master' => 'resources/views/layouts/master.blade.php',
            // 'composer'     => 'composer.json',
        ],
        'replacements' => [
            'start'           => ['LOWER_NAME'],
            'routes'          => ['LOWER_NAME', 'STUDLY_NAME', 'MODULE_NAMESPACE'],
            'json'            => ['LOWER_NAME', 'STUDLY_NAME', 'MODULE_NAMESPACE'],
            'scaffold/config' => ['STUDLY_NAME'],
            'composer'        => [
                'LOWER_NAME',
                'STUDLY_NAME',
                'VENDOR',
                'AUTHOR_NAME',
                'AUTHOR_EMAIL',
                'MODULE_NAMESPACE',
            ],
            // 'views/index'  => ['LOWER_NAME'],
            // 'views/master' => ['STUDLY_NAME'],
        ],
    ],
    'paths'     => [
        /*
        |--------------------------------------------------------------------------
        | Modules path
        |--------------------------------------------------------------------------
        |
        | This path used for save the generated module. This path also will added
        | automatically to list of scanned folders.
        |
        */

        'modules' => base_path('modules'),
        /*
        |--------------------------------------------------------------------------
        | Modules assets path
        |--------------------------------------------------------------------------
        |
        | Here you may update the modules assets path.
        |
        */

        'assets' => public_path('modules'),
        /*
        |--------------------------------------------------------------------------
        | The migrations path
        |--------------------------------------------------------------------------
        |
        | Where you run 'module:publish-migration' command, where do you publish the
        | the migration files?
        |
        */

        'migration' => base_path('database/migrations'),
        /*
        |--------------------------------------------------------------------------
        | Generator path
        |--------------------------------------------------------------------------
        |
        | Here you may update the modules generator path.
        |
        */

        'generator' => [
            // 'assets'     => 'assets',
            // 'seeder'     => 'database/seeders',
            // 'lang'       => 'resources/lang',
            // 'views'      => 'resources/views',
            'config'        => 'config',
            'test'          => 'tests',
            'migration'     => 'database/migrations',
            'command'       => 'app/Console/Commands',
            'event'         => 'app/Events',
            'listener'      => 'app/Events/Handlers',
            'model'         => 'app/Models',
            'controller'    => 'app/Http/Controllers',
            'request'       => 'app/Http/Requests',
            'provider'      => 'app/Providers',
            'jobs'          => 'app/Jobs',
            'emails'        => 'app/Emails',
            'notifications' => 'app/Notifications',
            // 'repository' => 'app/Repositories',
            // 'filter'     => 'app/Http/Middleware',
        ],
    ],
    /*
    |--------------------------------------------------------------------------
    | Scan Path
    |--------------------------------------------------------------------------
    |
    | Here you define which folder will be scanned. By default will scan vendor
    | directory. This is useful if you host the package in packagist website.
    |
    */

    'scan'      => [
        'enabled' => false,
        'paths'   => [
            base_path('vendor/*/*'),
        ],
    ],
    /*
    |--------------------------------------------------------------------------
    | Composer File Template
    |--------------------------------------------------------------------------
    |
    | Here is the config for composer.json file, generated by this package
    |
    */

    'composer'  => [
        'vendor'  => 'cariocacelulares',
        'authors' => [
            'Cleiton Souza <cleiton7souza@gmail.com>',
            'Diego Schell Fernandes <diego.schell.f@gmail.com>'
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    |
    | Here is the config for setting up caching feature.
    |
    */
    'cache'     => [
        'enabled'  => false,
        'key'      => 'laravel-modules',
        'lifetime' => 60,
    ],
    /*
    |--------------------------------------------------------------------------
    | Choose what laravel-modules will register as custom namespaces.
    | Setting one to false will require to register that part
    | in your own Service Provider class.
    |--------------------------------------------------------------------------
    */
    'register'  => [
        'translations' => true,
    ],
];
