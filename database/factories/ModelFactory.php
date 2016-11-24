<?php

$faker = Faker\Factory::create('pt_BR');

/**
 * Usuario
 */
$factory->define(\App\Models\Usuario\Usuario::class, function () use ($faker) {
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
$factory->define(\App\Models\Usuario\Role::class, function () use ($faker) {
  return [
    'name' => $faker->word,
  ];
});

/**
 * Senha
 */
$factory->define(\App\Models\Usuario\Senha::class, function () use ($faker) {
  return [
    'site'    => $faker->name,
    'url'     => $faker->url,
    'usuario' => $faker->userName,
    'senha'   => str_random(10)
  ];
});

/**
 * Código faturamento
 */
$factory->define(\App\Models\FaturamentoCodigo::class, function () use ($faker) {
  return [
    'servico' => $faker->unique()->numberBetween(0, 1),
    'atual'   => '97255050',
    'fim'     => '97256430'
  ];
});
