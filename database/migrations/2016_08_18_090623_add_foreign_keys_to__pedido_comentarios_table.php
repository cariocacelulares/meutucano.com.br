<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToPedidoComentariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_comentarios', function(Blueprint $table)
        {
            $table->foreign('pedido_id', 'PedidoComentariosPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('usuario_id', 'PedidoComentariosUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_comentarios', function(Blueprint $table)
        {
            $table->dropForeign('PedidoComentariosPedido');
            $table->dropForeign('PedidoComentariosUsuario');
        });
    }
}
