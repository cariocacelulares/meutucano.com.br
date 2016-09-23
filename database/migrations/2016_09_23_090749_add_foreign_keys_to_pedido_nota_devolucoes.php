<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToPedidoNotaDevolucoes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_nota_devolucoes', function(Blueprint $table)
        {
            $table->foreign('usuario_id', 'PedidoNotaDevolucaoUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
            $table->foreign('nota_id', 'PedidoNotaDevolucaoNota')->references('id')->on('pedido_notas')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_nota_devolucoes', function(Blueprint $table)
        {
            $table->dropForeign('PedidoNotaDevolucaoUsuario');
            $table->dropForeign('PedidoNotaDevolucaoNota');
        });
    }
}
