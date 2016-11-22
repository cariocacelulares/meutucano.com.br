<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoRastreioLogisticasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_rastreio_logisticas', function(Blueprint $table)
		{
			$table->foreign('rastreio_id', 'LogisticaPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_rastreio_logisticas', function(Blueprint $table)
		{
			$table->dropForeign('LogisticaPedidoRastreio');
		});
	}

}
