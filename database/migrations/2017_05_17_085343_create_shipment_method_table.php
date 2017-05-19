<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShipmentMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipment_methods', function($table) {
            $table->string('slug', 100);
            $table->string('title', 100);
            $table->string('service', 50)->nullable();
            $table->string('api_code', 50)->nullable();
            $table->primary('slug');
        });

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

        \DB::table('shipment_methods')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('shipment_methods');
    }
}
