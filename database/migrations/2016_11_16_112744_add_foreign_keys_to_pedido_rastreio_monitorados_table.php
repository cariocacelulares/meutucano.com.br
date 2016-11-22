<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoRastreioMonitoradosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_rastreio_monitorados', function(Blueprint $table)
		{
			$table->foreign('rastreio_id', 'PedidoRastreioMonitoradosRastreio')->references('id')->on('pedido_rastreios')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'PedidoRastreioMonitoradosUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_rastreio_monitorados', function(Blueprint $table)
		{
			$table->dropForeign('PedidoRastreioMonitoradosRastreio');
			$table->dropForeign('PedidoRastreioMonitoradosUsuario');
		});
	}

}
