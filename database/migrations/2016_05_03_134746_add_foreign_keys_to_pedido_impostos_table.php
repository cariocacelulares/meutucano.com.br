<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoImpostosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_impostos', function(Blueprint $table)
		{
			$table->foreign('pedido_id', 'PedidoImpostoPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_impostos', function(Blueprint $table)
		{
			$table->dropForeign('PedidoImpostoPedido');
		});
	}

}
