<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoRastreioDevolucoesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_rastreio_devolucoes', function(Blueprint $table)
		{
			$table->foreign('rastreio_id', 'DevolucaoPedidoRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_rastreio_devolucoes', function(Blueprint $table)
		{
			$table->dropForeign('DevolucaoPedidoRastreio');
		});
	}

}
