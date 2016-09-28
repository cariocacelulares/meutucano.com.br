<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdFieldAsPrimaryKeyToPedidoRastreioPisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->dropForeign('PiUsuario');
            $table->dropColumn('usuario_id');

            $table->dropForeign('PiPedidoRastreio');
            $table->dropPrimary('rastreio_id');
            $table->foreign('rastreio_id', 'PiPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->increments('id')->first();
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

        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
             $table->dropColumn('id');
        });

        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->integer('usuario_id')->unsigned()->after('rastreio_id');
            $table->foreign('usuario_id', 'PiUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');

            $table->dropForeign('PiPedidoRastreio');
            $table->primary('rastreio_id');
            $table->foreign('rastreio_id', 'PiPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
