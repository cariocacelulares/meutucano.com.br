<?php

$faker = Faker\Factory::create('pt_BR');

/**
 * Cliente
 */
$factory->define(\Modules\Core\Models\Cliente\Cliente::class, function () use ($faker) {
  return [
    'taxvat' => $faker->randomNumber(5) . $faker->randomNumber(6),
    'tipo'   => 0,
    'nome'   => $faker->name,
    'fone'   => $faker->randomNumber(5) . $faker->randomNumber(5),
    'email'  => $faker->email,
  ];
});

/**
 * Endereço
 */
$factory->define(\Modules\Core\Models\Cliente\Endereco::class, function () use ($faker) {
  return [
    'cep'          => $faker->randomNumber(8),
    'rua'          => $faker->streetName,
    'numero'       => $faker->buildingNumber,
    'complemento'  => $faker->streetSuffix,
    'bairro'       => 'Jardim américa',
    'cidade'       => $faker->city,
    'uf'           => 'SC',
  ];
});

/**
 * Produto
 */
$factory->define(\Modules\Core\Models\Produto\Produto::class, function () use ($faker) {
  return [
    'sku'    => $faker->unique()->numberBetween(0, 1000),
    'titulo' => 'Smartphone ' . $faker->randomNumber(2),
    'ean'    => $faker->isbn10,
    'estado' => 0
  ];
});

/**
 * Pedido
 */
$factory->define(\Modules\Core\Models\Pedido\Pedido::class, function () use ($faker) {
  return [
    'frete_valor'         => $faker->randomFloat(2, 10, 40),
    'frete_metodo'        => $faker->randomElement(['pac', 'sedex']),
    'pagamento_metodo'    => 'boleto',
    'marketplace'         => $faker->randomElement(['B2W', 'CNOVA', 'MERCADOLIVRE', 'SITE', 'WALMART']),
    'operacao'            => '6108',
    'total'               => $faker->randomFloat(2, 800, 3000),
    'status'              => $faker->numberBetween(0, 5)
  ];
});

/**
 * Rastreio
 */
$factory->define(\Modules\Core\Models\Pedido\Rastreio::class, function () use ($faker) {
  return [
    'data_envio' => $faker->dateTimeThisMonth->format('Y-m-d'),
    'rastreio'   => 'PJ' . $faker->randomNumber(9) . 'BR',
    'servico'    => 'PAC',
    'valor'      => $faker->randomFloat(2, 10, 30),
    'prazo'      => $faker->randomNumber(2),
    'status'     => 0,
  ];
});

$factory->define(\Modules\Core\Models\Pedido\Rastreio\Devolucao::class, function () use ($faker) {
  return [
    'motivo' => $faker->numberBetween(0, 7),
    'acao'   => $faker->numberBetween(0, 1)
  ];
});

$factory->define(\Modules\Core\Models\Pedido\Rastreio\Logistica::class, function () use ($faker) {
  return [
    'autorizacao'   => $faker->randomNumber(5) . $faker->randomNumber(6),
    'motivo'        => $faker->numberBetween(0, 4),
    'acao'          => $faker->numberBetween(0, 1),
    'data_postagem' => $faker->dateTimeThisMonth->format('d/m/Y')
  ];
});


$factory->define(\Modules\Core\Models\Pedido\Rastreio\Pi::class, function () use ($faker) {
  return [
    'codigo_pi'      => $faker->randomNumber(5) . $faker->randomNumber(5),
    'motivo_status'  => $faker->numberBetween(0, 4),
    'acao'           => $faker->numberBetween(0, 1),
    'data_pagamento' => $faker->dateTimeThisMonth->format('d/m/Y'),
    'valor_pago'     => $faker->randomFloat(2, 10, 20)
  ];
});


/**
 * Nota
 */
$factory->define(\Modules\Core\Models\Pedido\Nota::class, function () use ($faker) {
  return [
    'data'       => $faker->dateTimeThisMonth->format('Y-m-d'),
    'chave'      => str_random(44),
    'arquivo'    => str_random(30) . '.xml',
  ];
});

/**
 * Devolução
 */
$factory->define(\Modules\Core\Models\Pedido\Nota\Devolucao::class, function () use ($faker) {
  return [
    'data'    => $faker->dateTimeThisMonth->format('Y-m-d'),
    'chave'   => str_random(44),
    'arquivo' => str_random(30) . '.xml',
    'tipo'    => $faker->numberBetween(0, 1)
  ];
});

/**
 * Imposto
 */
$factory->define(\Modules\Core\Models\Pedido\Imposto::class, function () use ($faker) {
  return [
    'icms'              => $faker->randomFloat(2, 0, 50),
    'pis'               => $faker->randomFloat(2, 0, 50),
    'cofins'            => $faker->randomFloat(2, 0, 50),
    'icms_destinatario' => $faker->randomFloat(2, 0, 50),
    'icms_remetente'    => $faker->randomFloat(2, 0, 50),
  ];
});


/**
 * PedidoProduto
 */
$factory->define(\Modules\Core\Models\Pedido\PedidoProduto::class, function () use ($faker) {
  return [
    'valor'       => $faker->randomFloat(2, 500, 3000),
    'quantidade'  => 1,
  ];
});

/**
 * Comentário
 */
$factory->define(\Modules\Core\Models\Pedido\Comentario::class, function () use ($faker) {
  return [
    'comentario' => $faker->text(200)
  ];
});

/**
 * Código faturamento
 */
$factory->define(Modules\Core\Models\Pedido\FaturamentoCodigo::class, function () use ($faker) {
  return [
    'servico' => $faker->unique()->numberBetween(0, 1),
    'atual'   => '97255050',
    'fim'     => '97256430'
  ];
});