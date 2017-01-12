<?php

return [
    'fetch' => PDO::FETCH_CLASS,
    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [

        'mysql' => [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST', 'localhost'),
            'port'      => env('DB_PORT', '3306'),
            'database'  => env('DB_DATABASE', 'meutucano'),
            'username'  => env('DB_USERNAME', 'carioca'),
            'password'  => env('DB_PASSWORD', '#@carioca2016'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
            'engine'    => null,
        ],

        'tests' => [
            'driver'    => 'mysql',
            'host'      => env('DB_TEST_HOST', '45.55.210.205'),
            'port'      => env('DB_TEST_PORT', '3306'),
            'database'  => env('DB_TEST_DATABASE', 'meutucano_tests'),
            'username'  => env('DB_TEST_USERNAME', 'carioca'),
            'password'  => env('DB_TEST_PASSWORD', '#@carioca2016'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
            'engine'    => null,
        ],

        'mongodb' => [
            'driver'   => 'mongodb',
            'host'     => env('MONGODB_HOST', '45.55.208.16'),
            'port'     => env('MONGODB_PORT', 27017),
            'database' => env('MONGODB_DATABASE', 'meutucano'),
            'username' => env('MONGODB_USERNAME', 'carioca'),
            'password' => env('MONGODB_PASSWORD', 'carioca5102'),
            'options' => [
                'database' => 'meutucano'
            ]
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer set of commands than a typical key-value systems
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'cluster' => false,

        'default' => [
            'host' => env('REDIS_HOST', 'localhost'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => 0,
        ],

    ],

];
