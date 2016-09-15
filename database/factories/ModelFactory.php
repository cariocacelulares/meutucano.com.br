<?php

/**
 * Usuario
 */
$factory->define(\App\Models\Usuario\Usuario::class, function (Faker\Generator $faker) {
    return [
        'name'           => $faker->name,
        'email'          => $faker->safeEmail,
        'password'       => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
    ];
});

/**
 * Cliente
 */
$factory->define(\App\Models\Cliente\Cliente::class, function (Faker\Generator $faker) {
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
$factory->define(\App\Models\Cliente\Endereco::class, function (Faker\Generator $faker) {
    return [
        'cliente_id'   => 999,
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
$factory->define(\App\Models\Produto\Produto::class, function (Faker\Generator $faker) {
    return [
        'sku'    => $faker->unique()->numberBetween(0, 1000),
        'titulo' => 'Smartphone ' . $faker->randomNumber(2),
        'ean'    => $faker->isbn10,
    ];
});

/**
 * Pedido
 */
$factory->define(\App\Models\Pedido\Pedido::class, function (Faker\Generator $faker) {
    return [
        'cliente_id'          => 999,
        'cliente_endereco_id' => 999,
        'marketplace'         => $faker->randomElement(['B2W', 'CNOVA', 'MERCADOLIVRE', 'SITE', 'WALMART']),
        'operacao'            => '6108',
        'total'               => $faker->randomFloat(2, 800, 3000),
    ];
});

/**
 * Rastreio
 */
$factory->define(\App\Models\Pedido\Rastreio::class, function (Faker\Generator $faker) {
    return [
        'pedido_id'  => 999,
        'data_envio' => $faker->dateTimeThisMonth->format('Y-m-d'),
        'rastreio'   => 'PJ' . $faker->randomNumber(9) . 'BR',
        'servico'    => 'PAC',
        'valor'      => $faker->randomFloat(2, 10, 30),
        'prazo'      => $faker->randomNumber(2),
        'status'     => 0,
    ];
});

/**
 * Nota
 */
$factory->define(\App\Models\Pedido\Nota::class, function (Faker\Generator $faker) {
    return [
        'pedido_id'  => 999,
        'usuario_id' => 1,
        'data'       => $faker->dateTimeThisMonth->format('Y-m-d'),
        'chave'      => str_random(44),
        'arquivo'    => str_random(30) . '.xml',
    ];
});

/**
 * Imposto
 */
$factory->define(\App\Models\Pedido\Imposto::class, function (Faker\Generator $faker) {
    return [
        'pedido_id'         => 999,
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
$factory->define(\App\Models\Pedido\PedidoProduto::class, function (Faker\Generator $faker) {
    return [
        'pedido_id'   => 999,
        'produto_sku' => 999,
        'valor'       => $faker->randomFloat(2, 500, 3000),
        'quantidade'  => $faker->randomNumber(1),
    ];
});

/**
 * PedidoProduto
 */
$factory->define(\App\Models\Usuario\Senha::class, function (Faker\Generator $faker) {
    return [
        'usuario_id'  => 1,
        'site'        => str_random(),
        'url'         => $faker->url,
        'usuario'     => $faker->userName,
        'senha'       => $faker->password,
    ];
});