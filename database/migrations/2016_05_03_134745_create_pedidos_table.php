<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedidos', function(Blueprint $table)
		{
			$table->integer('id')->unsigned()->primary();
			$table->integer('cliente_id')->unsigned()->index('PedidoCliente');
			$table->integer('cliente_endereco_id')->unsigned()->index('PedidoClienteEndereco');
			$table->string('codigo_marketplace', 30)->nullable();
			$table->string('marketplace', 30)->nullable()->default('');
			$table->string('marketplace_adicional', 50)->nullable();
			$table->integer('operacao');
			$table->decimal('total', 10);
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
		Schema::drop('pedidos');
	}

}
