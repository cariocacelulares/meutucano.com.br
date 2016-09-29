<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToPedidoRastreioMonitoradosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreio_monitorados', function(Blueprint $table) {
            $table->foreign('rastreio_id', 'PedidoRastreioMonitoradosRastreio')->references('id')->on('pedido_rastreios')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('usuario_id', 'PedidoRastreioMonitoradosUsuario')->references('id')->on('usuarios')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreio_monitorados', function(Blueprint $table) {
            $table->dropForeign('PedidoRastreioMonitoradosRastreio');
            $table->dropForeign('PedidoRastreioMonitoradosUsuario');
        });
    }
}
