<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedidos', function(Blueprint $table)
		{
			$table->foreign('cliente_id', 'PedidoCliente')->references('id')->on('clientes')->onUpdate('CASCADE')->onDelete('RESTRICT');
			$table->foreign('cliente_endereco_id', 'PedidoClienteEndereco')->references('id')->on('cliente_enderecos')->onUpdate('CASCADE')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedidos', function(Blueprint $table)
		{
			$table->dropForeign('PedidoCliente');
			$table->dropForeign('PedidoClienteEndereco');
		});
	}

}
