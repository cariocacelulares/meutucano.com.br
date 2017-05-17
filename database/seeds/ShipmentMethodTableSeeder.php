<?php

use Core\Models\ShipmentMethod;
use Illuminate\Database\Seeder;

class ShipmentMethodTableSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'slug'    => 'withdraw',
                'title'   => 'Retirada em mãos',
                'service' => null
            ],
            [
                'slug'    => 'correios-pac',
                'title'   => 'Correios PAC',
                'service' => 'correios'
            ],
            [
                'slug'    => 'correios-sedex',
                'title'   => 'Correios SEDEX',
                'service' => 'correios'
            ],
            [
                'slug'    => 'correios-esedex',
                'title'   => 'Correios e-SEDEX',
                'service' => 'correios'
            ]
        ];

        ShipmentMethod::insert($data);
    }
}
