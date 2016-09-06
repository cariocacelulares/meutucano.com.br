<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoRastreioPisTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_rastreio_pis', function(Blueprint $table)
		{
			$table->foreign('rastreio_id', 'PiPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_rastreio_pis', function(Blueprint $table)
		{
			$table->dropForeign('PiPedidoRastreio');
		});
	}

}
