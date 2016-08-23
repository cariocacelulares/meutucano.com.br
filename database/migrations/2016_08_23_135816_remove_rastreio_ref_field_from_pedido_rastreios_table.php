<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveRastreioRefFieldFromPedidoRastreiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedido_rastreios', function (Blueprint $table) {
            $table->dropForeign('PedidoRastreioRastreioRef');
            $table->dropColumn(['rastreio_ref_id', 'tipo']);
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedido_rastreios', function (Blueprint $table) {
            $table->integer('rastreio_ref_id')->unsigned()->nullable()->after('pedido_id')->index('PedidoRastreioRastreioRef');
            $table->boolean('tipo')->default(0)->after('rastreio_ref_id');

            $table->foreign('rastreio_ref_id', 'PedidoRastreioRastreioRef')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
