<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePedidoLigacoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('pedido_ligacoes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('pedido_id')->unsigned();
			$table->integer('usuario_id')->unsigned()->nullable();
			$table->text('arquivo', 250);
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
		Schema::drop('pedido_ligacoes');
    }
}
