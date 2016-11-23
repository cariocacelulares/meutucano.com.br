<?php

$faker = Faker\Factory::create('pt_BR');

$factory->define(\Modules\InspecaoTecnica\Models\InspecaoTecnica::class, function() use ($faker) {
    return [
        'descricao'  => 'Nada',
        'priorizado' => 0,
        'reservado'  => 0,
    ];
});