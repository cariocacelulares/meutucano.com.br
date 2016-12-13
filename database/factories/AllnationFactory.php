<?php

$faker = Faker\Factory::create('pt_BR');

$factory->define(\Allnation\Models\AllnationProduct::class, function() use ($faker) {
    return [
        'id'          => $faker->unique()->numberBetween(0, 1000),
        'title'       => 'Smartphone ' . $faker->randomNumber(2),
        'category'    => str_random(30),
        'brand'       => str_random(30),
        'description' => str_random(30),
        'ean'         => $faker->randomNumber(5) . $faker->randomNumber(6),
        'ncm'         => $faker->randomNumber(5) . $faker->randomNumber(5),
        'warranty'    => str_random(10),
        'weight'      => $faker->randomFloat(2, 0, 50),
        'cost'        => $faker->randomFloat(2, 0, 50),
        'image'       => $faker->url,
        'stock_from'  => str_random(2),
        'width'       => $faker->randomFloat(2, 0, 50),
        'height'      => $faker->randomFloat(2, 0, 50),
        'length'      => $faker->randomFloat(2, 0, 50),
        'origin'      => str_random(30)
    ];
});