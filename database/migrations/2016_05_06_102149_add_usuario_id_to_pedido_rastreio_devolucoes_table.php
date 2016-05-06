<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUsuarioIdToPedidoRastreioDevolucoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
            $table->integer('usuario_id')->unsigned()->after('rastreio_id');
            $table->foreign('usuario_id', 'DevolucaoUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
            $table->dropColumn('usuario_id');
            $table->dropForeign('DevolucaoUsuario');
        });
    }
}
