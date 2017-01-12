<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoRastreiosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_rastreios', function(Blueprint $table)
		{
			$table->foreign('pedido_id', 'PedidoRastreioPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_rastreios', function(Blueprint $table)
		{
			$table->dropForeign('PedidoRastreioPedido');
		});
	}

}
