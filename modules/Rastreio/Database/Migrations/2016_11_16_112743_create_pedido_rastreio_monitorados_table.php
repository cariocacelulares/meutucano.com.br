<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoRastreioMonitoradosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_rastreio_monitorados', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rastreio_id')->unsigned()->index();
			$table->integer('usuario_id')->unsigned()->index();
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
		Schema::drop('pedido_rastreio_monitorados');
	}

}
