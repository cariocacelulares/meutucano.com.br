<?php

$faker = \Faker\Factory::create('pt_BR');

/**
* User
*/
$factory->define(App\Models\User\User::class, function () use ($faker) {
    return [
        'name'           => $faker->name,
        'email'          => $faker->safeEmail,
        'username'       => $faker->userName,
        'password'       => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
    ];
});

/**
* Role
*/
$factory->define(App\Models\User\Role::class, function () use ($faker) {
    return [
        'name' => $faker->word,
    ];
});

/**
* Password
*/
$factory->define(App\Models\User\Password::class, function () use ($faker) {
    return [
        'site'    => $faker->name,
        'url'     => $faker->url,
        'usuario' => $faker->userName,
        'senha'   => str_random(10)
    ];
});
