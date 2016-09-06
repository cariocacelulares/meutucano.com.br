<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePedidoComentariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedido_comentarios', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('pedido_id')->unsigned()->index('PedidoComentariosPedido');
            $table->integer('usuario_id')->unsigned()->index('PedidoComentariosUsuario');
            $table->text('comentario', 65535);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('pedido_comentarios');
    }
}
