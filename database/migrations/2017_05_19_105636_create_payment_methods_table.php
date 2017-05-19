<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentMethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_methods', function($table) {
            $table->string('slug', 100);
            $table->string('title', 100);
            $table->primary('slug');
        });

        $data = [
            [
                'slug'     => 'credito',
                'title'    => 'Cartão de Crédito',
            ],
            [
                'slug'     => 'debito',
                'title'    => 'Cartão de Débito',
            ],
            [
                'slug'     => 'boleto',
                'title'    => 'Boleto Bancário',
            ],
            [
                'slug'     => 'mercadopago',
                'title'    => 'Mercado Pago',
            ],
            [
                'slug'     => 'outro',
                'title'    => 'Outro',
            ]
        ];

        \DB::table('payment_methods')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('payment_methods');
    }
}
