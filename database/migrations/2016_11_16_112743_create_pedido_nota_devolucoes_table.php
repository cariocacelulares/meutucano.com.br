<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoNotaDevolucoesTable extends Migration {

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
			$table->integer('usuario_id')->unsigned()->nullable()->index('PedidoNotaDevolucaoUsuario');
			$table->integer('nota_id')->unsigned()->nullable()->index('PedidoNotaDevolucaoNota');
			$table->string('chave', 50);
			$table->string('arquivo', 250)->nullable();
			$table->boolean('tipo')->default(0);
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
