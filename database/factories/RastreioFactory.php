<?php

$faker = Faker\Factory::create('pt_BR');

$factory->define(\Rastreio\Models\Rastreio::class, function () use ($faker) {
  return [
    'data_envio' => $faker->dateTimeThisMonth->format('Y-m-d'),
    'rastreio'   => 'PJ' . $faker->randomNumber(9) . 'BR',
    'servico'    => 'PAC',
    'valor'      => $faker->randomFloat(2, 10, 30),
    'prazo'      => $faker->randomNumber(2),
    'status'     => 0,
  ];
});

$factory->define(\Rastreio\Models\Devolucao::class, function () use ($faker) {
  return [
    'motivo' => $faker->numberBetween(0, 7),
    'acao'   => $faker->numberBetween(0, 1)
  ];
});

$factory->define(\Rastreio\Models\Logistica::class, function () use ($faker) {
  return [
    'autorizacao'   => $faker->randomNumber(5) . $faker->randomNumber(6),
    'motivo'        => $faker->numberBetween(0, 4),
    'acao'          => $faker->numberBetween(0, 1)
  ];
});


$factory->define(\Rastreio\Models\Pi::class, function () use ($faker) {
  return [
    'codigo_pi'      => $faker->randomNumber(5) . $faker->randomNumber(5),
    'motivo_status'  => $faker->numberBetween(0, 4),
    'acao'           => $faker->numberBetween(0, 1),
    'data_pagamento' => $faker->dateTimeThisMonth->format('d/m/Y'),
    'valor_pago'     => $faker->randomFloat(2, 10, 20)
  ];
});
