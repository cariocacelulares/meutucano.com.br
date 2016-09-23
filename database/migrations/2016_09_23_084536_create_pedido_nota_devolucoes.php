<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePedidoNotaDevolucoes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedido_nota_devolucoes', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index('PedidoNotaDevolucaoUsuario');
            $table->integer('nota_id')->unsigned()->nullable()->index('PedidoNotaDevolucaoNota');
            $table->string('chave', 50)->default(null);
            $table->string('arquivo', 250)->nullable();
            $table->tinyInteger('tipo')->default(0)->comment('0 - devolucao, 1 - estorno');
            $table->date('data')->nullable();
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
        Schema::drop('pedido_nota_devolucoes');
    }
}
