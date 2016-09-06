<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdFieldAsPrimaryKeyToPedidoNotasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedido_notas', function (Blueprint $table) {
            $table->dropForeign('PedidoNotaPedido');
            $table->dropPrimary('pedido_id');
            $table->foreign('pedido_id', 'PedidoNotaPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        Schema::table('pedido_notas', function (Blueprint $table) {
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

        Schema::table('pedido_notas', function (Blueprint $table) {
             $table->dropColumn('id');
        });

        Schema::table('pedido_notas', function (Blueprint $table) {
            $table->dropForeign('PedidoNotaPedido');
            $table->primary('pedido_id');
            $table->foreign('pedido_id', 'PedidoNotaPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
