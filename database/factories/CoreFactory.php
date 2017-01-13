<?php

$faker = Faker\Factory::create('pt_BR');

/**
* Cliente
*/
$factory->define(\Core\Models\Cliente\Cliente::class, function () use ($faker) {
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
$factory->define(\Core\Models\Cliente\Endereco::class, function () use ($faker) {
    return [
        'cep'         => $faker->randomNumber(8),
        'rua'         => $faker->streetName,
        'numero'      => $faker->buildingNumber,
        'complemento' => $faker->streetSuffix,
        'bairro'      => 'Jardim américa',
        'cidade'      => $faker->city,
        'uf'          => 'SC',
    ];
});

/**
* Stock
*/
$factory->define(\Core\Models\Stock::class, function () use ($faker) {
    $name = $faker->name;

    return [
        'title'    => $name,
        'slug'     => str_slug($name),
        'include'  => $faker->numberBetween(1, 2),
        'priority' => $faker->unique()->randomNumber(2),
    ];
});

/**
* ProductStock
*/
$factory->define(\Core\Models\Produto\ProductStock::class, function () use ($faker) {
    return [
        'quantity' => $faker->randomNumber(1),
    ];
});

/**
* Produto
*/
$factory->define(\Core\Models\Produto\Produto::class, function () use ($faker) {
    return [
        'titulo' => 'Smartphone ' . $faker->randomNumber(2),
        'ean'    => $faker->isbn10,
        'estado' => 0
    ];
});

/**
* Pedido
*/
$factory->define(\Core\Models\Pedido\Pedido::class, function () use ($faker) {
    return [
        'frete_valor'      => $faker->randomFloat(2, 10, 40),
        'frete_metodo'     => $faker->randomElement(['pac', 'sedex']),
        'pagamento_metodo' => 'boleto',
        'marketplace'      => $faker->randomElement(['B2W', 'CNOVA', 'MERCADOLIVRE', 'SITE', 'WALMART']),
        'operacao'         => '6108',
        'total'            => $faker->randomFloat(2, 800, 3000),
        'status'           => $faker->numberBetween(0, 5)
    ];
});

/**
* Nota
*/
$factory->define(\Core\Models\Pedido\Nota::class, function () use ($faker) {
    return [
        'data'    => $faker->dateTimeThisMonth->format('Y-m-d'),
        'chave'   => str_random(44),
        'arquivo' => str_random(30) . '.xml',
    ];
});

/**
* Devolução
*/
$factory->define(\Core\Models\Pedido\Nota\Devolucao::class, function () use ($faker) {
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
$factory->define(\Core\Models\Pedido\Imposto::class, function () use ($faker) {
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
$factory->define(\Core\Models\Pedido\PedidoProduto::class, function () use ($faker) {
    return [
        'valor'      => $faker->randomFloat(2, 500, 3000),
        'quantidade' => 1,
    ];
});

/**
* Comentário
*/
$factory->define(\Core\Models\Pedido\Comentario::class, function () use ($faker) {
    return [
        'comentario' => $faker->text(200)
    ];
});

/**
* Código faturamento
*/
$factory->define(Core\Models\Pedido\FaturamentoCodigo::class, function () use ($faker) {
    return [
        'servico' => $faker->unique()->numberBetween(0, 1),
        'prefix'  => str_random(2),
        'atual'   => '97255050',
        'fim'     => '97256430'
    ];
});
