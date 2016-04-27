<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoNotasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_notas', function(Blueprint $table)
		{
			$table->integer('pedido_id')->unsigned()->primary();
			$table->integer('usuario_id')->unsigned();
			$table->date('data');
			$table->string('chave', 50)->default('');
			$table->string('arquivo', 250)->nullable();
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
		Schema::drop('pedido_notas');
	}

}
