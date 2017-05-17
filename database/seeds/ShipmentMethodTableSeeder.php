<?php

use Core\Models\ShipmentMethod;
use Illuminate\Database\Seeder;

class ShipmentMethodTableSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'slug'     => 'withdraw',
                'title'    => 'Retirada em mãos',
                'service'  => null,
                'api_code' => null
            ],
            [
                'slug'     => 'correios-pac',
                'title'    => 'Correios PAC',
                'service'  => 'correios',
                'api_code' => '04510'
            ],
            [
                'slug'     => 'correios-sedex',
                'title'    => 'Correios SEDEX',
                'service'  => 'correios',
                'api_code' => '04014'
            ],
            [
                'slug'     => 'correios-esedex',
                'title'    => 'Correios e-SEDEX',
                'service'  => 'correios',
                'api_code' => '81019'
            ]
        ];

        ShipmentMethod::insert($data);
    }
}
