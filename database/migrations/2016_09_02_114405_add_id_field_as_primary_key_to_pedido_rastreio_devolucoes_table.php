<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdFieldAsPrimaryKeyToPedidoRastreioDevolucoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
            $table->dropForeign('DevolucaoUsuario');
            $table->dropColumn('usuario_id');

            $table->dropForeign('DevolucaoPedidoRastreio');
            $table->dropPrimary('rastreio_id');
            $table->foreign('rastreio_id', 'DevolucaoPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
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

        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
             $table->dropColumn('id');
        });

        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
            $table->integer('usuario_id')->unsigned()->after('rastreio_id');
            $table->foreign('usuario_id', 'DevolucaoUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');

            $table->dropForeign('DevolucaoPedidoRastreio');
            $table->primary('rastreio_id');
            $table->foreign('rastreio_id', 'DevolucaoPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
