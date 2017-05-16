<?php

$faker = Faker\Factory::create('pt_BR');

$factory->define(\Core\Models\Customer::class, function () use ($faker) {
    return [
        'taxvat'   => $faker->randomNumber(5) . $faker->randomNumber(6),
        'type'     => 0,
        'name'     => $faker->name,
        'phone'    => $faker->randomNumber(5) . $faker->randomNumber(5),
        'email'    => $faker->email,
        'document' => null,
    ];
});

/**
* Endereço
*/
$factory->define(\Core\Models\Cliente\Endereco::class, function () use ($faker) {
    return [
        'cep'         => '89160216',
        'rua'         => $faker->streetName,
        'numero'      => $faker->buildingNumber,
        'complemento' => $faker->streetSuffix,
        'bairro'      => 'Centro',
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
        'slug'     => str_slug($name),
        'title'    => $name,
        'include'  => $faker->numberBetween(0, 1),
        'priority' => $faker->unique()->randomNumber(2),
    ];
});

/**
* ProductStock
*/
$factory->define(\Core\Models\Produto\ProductStock::class, function () use ($faker) {
    return [
        'quantity'       => $faker->numberBetween(1, 100),
        'serial_enabled' => $faker->numberBetween(0, 1),
    ];
});

/**
* ProductImei
*/
$factory->define(\Core\Models\Produto\ProductImei::class, function () use ($faker) {
    return [
        'imei' => str_random(15),
        'cost' => null,
    ];
});

/**
* Produto
*/
$factory->define(\Core\Models\Produto::class, function () use ($faker) {
    return [
        'titulo' => 'Smartphone ' . $faker->randomNumber(2),
        'ean'    => $faker->ean8,
        'estado' => 0,
        'ncm'    => $faker->isbn10,
        'valor'  => $faker->randomFloat(2, 500, 1000),
        'cost'   => 0,
    ];
});

/**
* Pedido
*/
$factory->define(\Core\Models\Pedido::class, function () use ($faker) {
    return [
        'frete_valor'         => $faker->randomFloat(2, 10, 40),
        'frete_metodo'        => $faker->randomElement(['pac', 'sedex']),
        'pagamento_metodo'    => 'boleto',
        'parcelas'            => 1,
        'marketplace'         => $faker->randomElement(['B2W', 'CNOVA', 'MERCADOLIVRE', 'SITE', 'WALMART']),
        'operacao'            => '6108',
        'total'               => $faker->randomFloat(2, 800, 3000),
        'status'              => $faker->numberBetween(0, 5),
        'codigo_api'          => null,
        'codigo_marketplace'  => null,
        'estimated_delivery'  => null,
        'protocolo'           => null,
        'imagem_cancelamento' => null,
        'segurado'            => false,
        'reembolso'           => false,
        'priorizado'          => false,
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
        'valor' => $faker->randomFloat(2, 500, 3000),
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
        'fim'     => '97256430',
    ];
});

/**
 * Stock Removal
 */
 $factory->define(Core\Models\Stock\Removal::class, function () use ($faker) {
     return [
     ];
 });

/**
 * Stock Removal Product
 */
 $factory->define(Core\Models\Stock\RemovalProduct::class, function () use ($faker) {
     return [
         'status' => $faker->numberBetween(0, 3),
     ];
 });

/**
 * Stock Issue
 */
 $factory->define(Core\Models\Stock\Issue::class, function () use ($faker) {
     return [
         'reason'      => $faker->text(10),
         'description' => $faker->text(50),
     ];
 });

/**
 * Product Defect
 */
 $factory->define(Core\Models\Produto\Defect::class, function () use ($faker) {
     return [
         'description' => $faker->text(50),
     ];
 });

/**
 * Stock Entry
 */
 $factory->define(Core\Models\Stock\Entry::class, function () use ($faker) {
     return [
         'description' => $faker->text(50),
     ];
 });

/**
 * Supplier
 */
 $factory->define(Core\Models\Supplier::class, function () use ($faker) {
     return [
         'company_name' => $faker->company,
         'name'         => $faker->company,
         'cnpj'         => $faker->cnpj(false),
         'ie'           => $faker->randomNumber(6),
         'crt'          => 3,
         'fone'         => $faker->areaCode . str_replace('-', '', $faker->cellphone),
         'street'       => $faker->streetName,
         'number'       => $faker->buildingNumber,
         'complement'   => $faker->secondaryAddress,
         'neighborhood' => $faker->citySuffix,
         'city'         => $faker->city,
         'uf'           => $faker->regionAbbr,
         'cep'          => $faker->randomNumber(8),
         'country'      => $faker->country,
     ];
 });

/**
 * Entry Invoice
 */
 $factory->define(Core\Models\Stock\Entry\Invoice::class, function () use ($faker) {
     return [
         'key'      => $faker->numerify('##########################################'),
         'series'   => rand(1,9),
         'number'   => $faker->randomNumber(6),
         'model'    => 55,
         'cfop'     => $faker->randomNumber(4),
         'total'    => $faker->randomFloat(2, 100, 1000000),
         'file'     => $faker->userName . '.xml',
         'emission' => $faker->date('Y-m-d H:i:s', 'now'),
     ];
 });

/**
 * Entry Product
 */
$factory->define(Core\Models\Stock\Entry\Product::class, function () use ($faker) {
    $qty     = rand(1, 9);
    $unitary = $faker->randomFloat(2, 10, 500);
    $total   = ($unitary * $qty);

    return [
        'quantity'      => $qty,
        'unitary_value' => $unitary,
        'total_value'   => $total,
        'icms'          => rand(1, 9),
        'ipi'           => rand(1, 9),
        'pis'           => rand(1, 9),
        'cofins'        => rand(1, 9),
        'imeis'         => null,
    ];
});
